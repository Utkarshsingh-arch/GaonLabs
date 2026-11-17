import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma, disconnectDatabase } from '../shared/database/prisma';
import { identityService } from '../modules/identity';
import { consentService } from '../modules/consent';
import { academicService } from '../modules/academic';
import { syncService } from '../modules/sync';
import { featureFlagsService } from '../modules/feature-flags';
import { integrationGatewayService } from '../modules/integration';

describe('Identity, Consent, Sync, and Policy Domain Tests', () => {
  let minorPersonId: string;
  let guardianPersonId: string;
  let policyId: string;

  beforeAll(async () => {
    // 1. Create a Minor Account
    const minorAccount = await identityService.createAccount({
      loginIdentifier: `minor_student_${Date.now()}`,
      displayName: 'Sunita Basavaraj',
      accountType: 'LEARNER',
      status: 'REGISTERED_PENDING_CONSENT',
    });
    minorPersonId = minorAccount.personId;

    // 2. Create a Guardian Account
    const guardianAccount = await identityService.createAccount({
      loginIdentifier: `guardian_parent_${Date.now()}`,
      displayName: 'Basavaraj (Parent)',
      accountType: 'GUARDIAN',
      status: 'ACTIVATED',
    });
    guardianPersonId = guardianAccount.personId;

    // 3. Link Guardian to Minor
    await identityService.linkGuardian({
      minorPersonId,
      guardianPersonId,
      relationshipType: 'FATHER',
      isPrimary: true,
    });

    // 4. Create Active Consent Policy
    const policy = await consentService.createPolicy({
      version: `DPDP-2026-v${Date.now()}`,
      title: 'GaonLab Child Privacy and Data Processing Policy',
      content: 'Clear explanation of educational data processing under DPDP Act 2023.',
    });
    policyId = policy.id;
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('Minor account initiates in REGISTERED_PENDING_CONSENT status', async () => {
    const minor = await identityService.getPersonById(minorPersonId);
    expect(minor.account.status).toBe('REGISTERED_PENDING_CONSENT');
  });

  it('SMS OTP only verifies phone possession; adult declaration alone is NOT verified adulthood', async () => {
    const request = await consentService.requestGuardianConsent({
      minorPersonId,
      guardianPersonId,
      policyId,
      purposes: ['BASIC_LEARNING', 'OFFLINE_SYNC'],
      verificationMethod: 'MULTI_FACTOR_TOKEN_DECLARATION',
    });

    // Adult declaration missing -> Rejection
    await expect(
      consentService.verifyGuardian({
        verificationCaseId: request.verificationCaseId,
        methodUsed: 'MULTI_FACTOR_TOKEN_DECLARATION',
        isAdultDeclared: false,
      })
    ).rejects.toThrow('guardian adult declaration is mandatory');

    // SMS Token verified with Adult Declaration alone, but WITHOUT external adult verification reference
    const partialVerification = await consentService.verifyGuardian({
      verificationCaseId: request.verificationCaseId,
      methodUsed: 'MULTI_FACTOR_TOKEN_DECLARATION',
      isAdultDeclared: true,
      phoneVerified: true,
      // No providerReference and no verifiedByActorId
    });

    // Phone is verified, but adultVerified remains false and overall status is PENDING
    expect(partialVerification.isVerified).toBe(false);
    expect(partialVerification.verificationStatus).toBe('PENDING');

    // Attempting to activate minor account must fail because adult verification is incomplete
    await expect(
      consentService.activateMinorAccountIfEligible(minorPersonId)
    ).rejects.toThrow('Lawful guardian adulthood and relationship verification not completed');
  });

  it('Minor account activates ONLY when lawful adult verification and consent are completed', async () => {
    const request = await consentService.requestGuardianConsent({
      minorPersonId,
      guardianPersonId,
      policyId,
      purposes: ['BASIC_LEARNING', 'OFFLINE_SYNC'],
      verificationMethod: 'TEACHER_ATTESTED_PHYSICAL',
    });

    // Teacher-attested physical verification with verifiedByActorId
    const teacherVerification = await consentService.verifyGuardian({
      verificationCaseId: request.verificationCaseId,
      methodUsed: 'TEACHER_ATTESTED_PHYSICAL',
      isAdultDeclared: true,
      verifiedByActorId: 'HEADMASTER_UUID_123',
    });

    expect(teacherVerification.isVerified).toBe(true);
    expect(teacherVerification.verificationStatus).toBe('VERIFIED');

    // Grant consent
    const granted = await consentService.grantConsent(request.consentRecordId);
    expect(granted.status).toBe('GRANTED');

    // Now account activation succeeds
    const activation = await consentService.activateMinorAccountIfEligible(minorPersonId);
    expect(activation.isActivated).toBe(true);

    const minor = await identityService.getPersonById(minorPersonId);
    expect(minor.account.status).toBe('ACTIVATED');
  });

  it('Consent can be granted and subsequently revoked', async () => {
    const request = await consentService.requestGuardianConsent({
      minorPersonId,
      guardianPersonId,
      policyId,
      purposes: ['ACADEMIC_HISTORY_TRACKING'],
      verificationMethod: 'MOCK_MANUAL_DEV',
    });

    await consentService.verifyGuardian({
      verificationCaseId: request.verificationCaseId,
      methodUsed: 'MOCK_MANUAL_DEV',
      isAdultDeclared: true,
    });

    // Grant consent
    const granted = await consentService.grantConsent(request.consentRecordId);
    expect(granted.status).toBe('GRANTED');
    expect(granted.grantedAt).toBeDefined();

    // Revoke consent
    const revoked = await consentService.revokeConsent(
      request.consentRecordId,
      'Guardian requested data processing halt'
    );
    expect(revoked.status).toBe('REVOKED');
    expect(revoked.revokedAt).toBeDefined();
  });

  it('Historical academic enrollments are preserved across academic years without overwriting', async () => {
    // Grade 6 in 2025-2026
    await academicService.enrollLearner({
      learnerPersonId: minorPersonId,
      boardId: 'CBSE',
      academicYear: '2025-2026',
      officialGrade: 6,
      primaryMedium: 'en',
      status: 'COMPLETED',
    });

    // Grade 7 in 2026-2027 (Active)
    await academicService.enrollLearner({
      learnerPersonId: minorPersonId,
      boardId: 'CBSE',
      academicYear: '2026-2027',
      officialGrade: 7,
      primaryMedium: 'en',
      status: 'ACTIVE',
    });

    const history = await academicService.getEnrollmentHistory(minorPersonId);
    expect(history.length).toBeGreaterThanOrEqual(2);

    const active = await academicService.getActiveEnrollment(minorPersonId);
    expect(active.academicYear).toBe('2026-2027');
    expect(active.officialGrade).toBe(7);
  });

  it('Sync service enforces idempotent deduplication on eventId', async () => {
    const deviceId = `dev_phone_${Date.now()}`;
    await syncService.registerDevice({
      deviceId,
      accountPersonId: minorPersonId,
      deviceModel: 'Redmi 9A',
      osVersion: 'Android 10',
      appVersion: '1.0.0',
    });

    const clientEventId = crypto.randomUUID();

    // First ingestion attempt
    const firstResult = await syncService.ingestEvent({
      eventId: clientEventId,
      deviceId,
      learnerPersonId: minorPersonId,
      eventType: 'EXPERIMENT_COMPLETED',
      payload: { experimentId: 'turmeric-indicator-01', observation: 'Turned Red' },
    });

    expect(firstResult.status).toBe('PROCESSED');
    expect(firstResult.isDuplicate).toBe(false);

    // Duplicate ingestion attempt with identical eventId
    const duplicateResult = await syncService.ingestEvent({
      eventId: clientEventId,
      deviceId,
      learnerPersonId: minorPersonId,
      eventType: 'EXPERIMENT_COMPLETED',
      payload: { experimentId: 'turmeric-indicator-01', observation: 'Turned Red' },
    });

    expect(duplicateResult.status).toBe('DUPLICATE');
    expect(duplicateResult.isDuplicate).toBe(true);
  });

  it('Feature flags support multi-dimensional policy gating', async () => {
    await featureFlagsService.createOrUpdateFlag({
      key: 'PHYSICS_PLAYGROUND_BETA',
      description: 'Physics sandbox experimental feature',
      isEnabledGlobally: false,
      enabledEnvironments: ['development', 'staging'],
      allowedCategories: ['MIDDLE', 'SECONDARY'],
    });

    const enabledForMiddleInDev = await featureFlagsService.isEnabled('PHYSICS_PLAYGROUND_BETA', {
      environment: 'development',
      learnerCategory: 'MIDDLE',
    });
    expect(enabledForMiddleInDev).toBe(true);

    const disabledInProd = await featureFlagsService.isEnabled('PHYSICS_PLAYGROUND_BETA', {
      environment: 'production',
      learnerCategory: 'MIDDLE',
    });
    expect(disabledInProd).toBe(false);

    const disabledForPrimary = await featureFlagsService.isEnabled('PHYSICS_PLAYGROUND_BETA', {
      environment: 'development',
      learnerCategory: 'PRIMARY',
    });
    expect(disabledForPrimary).toBe(false);
  });

  it('Government Integration Gateway registers providers and tracks operational modes', async () => {
    await integrationGatewayService.registerProvider({
      id: 'PROV_BHASHINI',
      code: 'BHASHINI',
      name: 'BHASHINI National Language Translation Mission',
      officialPortalUrl: 'https://bhashini.gov.in',
      operationalMode: 'MOCK',
      isEnabled: true,
      description: 'Speech and machine translation APIs for Indian languages',
    });

    const status = await integrationGatewayService.getProviderStatus('BHASHINI');
    expect(status.operationalMode).toBe('MOCK');
    expect(status.isHealthy).toBe(true);

    // Switch mode to CACHED
    await integrationGatewayService.setProviderMode('BHASHINI', 'CACHED');
    const updatedStatus = await integrationGatewayService.getProviderStatus('BHASHINI');
    expect(updatedStatus.operationalMode).toBe('CACHED');
  });
});
