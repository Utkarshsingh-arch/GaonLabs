import { prisma } from '../../shared/database/prisma';
import { AppError, NotFoundError, ValidationError } from '../../shared/errors';
import { eventBus } from '../../shared/events';
import {
  CreateConsentPolicyInput,
  IConsentService,
  IGuardianVerificationProvider,
  RequestGuardianConsentInput,
  VerificationEvidence,
  VerifyGuardianInput,
} from './consent.contracts';
import { ConsentStatus, GuardianVerificationStatus } from '@gaonlab/shared-types';

/**
 * Provider-independent Mock Verification Provider
 * Strictly isolated for local development testing; forbidden in production.
 */
export class MockGuardianVerificationProvider implements IGuardianVerificationProvider {
  public readonly providerId = 'MOCK_DEV_PROVIDER';
  public readonly isProductionReady = false;

  async verifyGuardian(caseId: string, params: Record<string, unknown>): Promise<VerificationEvidence> {
    if (process.env.NODE_ENV === 'production') {
      throw new ValidationError('MockGuardianVerificationProvider is prohibited in production');
    }

    return {
      providerId: this.providerId,
      isMock: true,
      phoneVerified: Boolean(params.phoneVerified ?? true),
      adultVerified: Boolean(params.adultVerified ?? true),
      relationshipVerified: Boolean(params.relationshipVerified ?? true),
      evidenceType: 'DEVELOPER_MOCK_PAYLOAD',
      evidenceReference: `MOCK-${Date.now()}`,
      metadata: { mockReason: 'Automated test suite execution' },
    };
  }
}

export class ConsentService implements IConsentService {
  private mockProvider = new MockGuardianVerificationProvider();

  async createPolicy(input: CreateConsentPolicyInput) {
    return prisma.consentPolicy.create({
      data: {
        version: input.version,
        title: input.title,
        content: input.content,
        effectiveFrom: input.effectiveFrom || new Date(),
        effectiveTo: input.effectiveTo,
        isCurrent: true,
      },
    });
  }

  async getActivePolicy() {
    const policy = await prisma.consentPolicy.findFirst({
      where: { isCurrent: true },
      orderBy: { effectiveFrom: 'desc' },
    });
    if (!policy) {
      throw new NotFoundError('Active ConsentPolicy');
    }
    return policy;
  }

  async requestGuardianConsent(input: RequestGuardianConsentInput) {
    return prisma.$transaction(async (tx) => {
      const verificationCase = await tx.guardianVerificationCase.create({
        data: {
          guardianPersonId: input.guardianPersonId,
          minorPersonId: input.minorPersonId,
          verificationMethod: input.verificationMethod,
          verificationStatus: 'PENDING',
          isPhoneVerified: false,
          isAdultVerified: false,
          isRelationshipVerified: false,
          isMockVerification: input.verificationMethod === 'MOCK_MANUAL_DEV',
        },
      });

      const consentRecord = await tx.consentRecord.create({
        data: {
          minorPersonId: input.minorPersonId,
          guardianPersonId: input.guardianPersonId,
          policyId: input.policyId,
          purposes: input.purposes as any,
          status: 'REQUESTED',
          verificationCaseId: verificationCase.id,
        },
      });

      eventBus.publish({
        eventId: crypto.randomUUID(),
        type: 'CONSENT_REQUESTED',
        schemaVersion: '1.0.0',
        occurredAt: new Date().toISOString(),
        learnerId: input.minorPersonId,
        payload: {
          consentRecordId: consentRecord.id,
          verificationCaseId: verificationCase.id,
          verificationMethod: input.verificationMethod,
        },
      });

      return {
        consentRecordId: consentRecord.id,
        verificationCaseId: verificationCase.id,
      };
    });
  }

  async verifyGuardian(input: VerifyGuardianInput): Promise<{ isVerified: boolean; verificationStatus: GuardianVerificationStatus }> {
    const verificationCase = await prisma.guardianVerificationCase.findUnique({
      where: { id: input.verificationCaseId },
    });

    if (!verificationCase) {
      throw new NotFoundError('GuardianVerificationCase', input.verificationCaseId);
    }

    const isMock = input.methodUsed === 'MOCK_MANUAL_DEV';
    if (isMock && process.env.NODE_ENV === 'production') {
      throw new ValidationError('MOCK_MANUAL_DEV verification is prohibited in production');
    }

    // ARCHITECTURAL MANDATE:
    // 1. Guardian adult declaration is mandatory.
    // 2. However, adult declaration alone does NOT equal verified adulthood in production.
    if (!input.isAdultDeclared) {
      throw new ValidationError('Verification rejected: guardian adult declaration is mandatory');
    }

    let phoneVerified = Boolean(input.phoneVerified);
    let adultVerified = Boolean(input.adultVerified);
    let relationshipVerified = Boolean(input.relationshipVerified);

    if (isMock) {
      const mockEvidence = await this.mockProvider.verifyGuardian(input.verificationCaseId, {
        phoneVerified: input.phoneVerified ?? true,
        adultVerified: input.adultVerified ?? true,
        relationshipVerified: input.relationshipVerified ?? true,
      });
      phoneVerified = mockEvidence.phoneVerified;
      adultVerified = mockEvidence.adultVerified;
      relationshipVerified = mockEvidence.relationshipVerified;
    } else {
      // In non-mock verification:
      // Phone OTP only verifies phone possession
      if (input.methodUsed === 'MULTI_FACTOR_TOKEN_DECLARATION') {
        phoneVerified = true;
        // Adult declaration alone without separate adult identity proof cannot mark adultVerified = true
        // unless backed by verified providerReference or verifiedByActorId
        if (input.verifiedByActorId || input.providerReference) {
          adultVerified = input.adultVerified ?? true;
          relationshipVerified = input.relationshipVerified ?? true;
        } else {
          adultVerified = false; // Declaration alone is not verified identity
          relationshipVerified = false;
        }
      } else if (input.methodUsed === 'TEACHER_ATTESTED_PHYSICAL') {
        if (!input.verifiedByActorId) {
          throw new ValidationError('Teacher attested verification requires verifiedByActorId');
        }
        phoneVerified = true;
        adultVerified = true;
        relationshipVerified = true;
      }
    }

    const isFullyVerified = phoneVerified && adultVerified && relationshipVerified;
    const verificationStatus: GuardianVerificationStatus = isFullyVerified ? 'VERIFIED' : 'PENDING';

    const updated = await prisma.guardianVerificationCase.update({
      where: { id: input.verificationCaseId },
      data: {
        verificationStatus,
        verificationMethod: input.methodUsed,
        isPhoneVerified: phoneVerified,
        isAdultVerified: adultVerified,
        isRelationshipVerified: relationshipVerified,
        isMockVerification: isMock,
        providerReference: input.providerReference,
        evidenceMetadata: {
          ...(input.evidenceMetadata || {}),
          verifiedAt: new Date().toISOString(),
          isDevMock: isMock,
          adultDeclared: input.isAdultDeclared,
        },
        verifiedAt: isFullyVerified ? new Date() : null,
        verifiedByActorId: input.verifiedByActorId,
      },
    });

    if (isFullyVerified) {
      eventBus.publish({
        eventId: crypto.randomUUID(),
        type: 'GUARDIAN_VERIFIED',
        schemaVersion: '1.0.0',
        occurredAt: new Date().toISOString(),
        learnerId: updated.minorPersonId,
        payload: {
          verificationCaseId: updated.id,
          status: updated.verificationStatus,
          method: updated.verificationMethod,
          isMock,
        },
      });
    }

    return {
      isVerified: isFullyVerified,
      verificationStatus,
    };
  }

  async grantConsent(consentRecordId: string) {
    const record = await prisma.consentRecord.findUnique({
      where: { id: consentRecordId },
      include: { verificationCase: true },
    });

    if (!record) {
      throw new NotFoundError('ConsentRecord', consentRecordId);
    }

    if (
      !record.verificationCase ||
      record.verificationCase.verificationStatus !== 'VERIFIED' ||
      !record.verificationCase.isAdultVerified ||
      !record.verificationCase.isRelationshipVerified
    ) {
      throw new ValidationError(
        'Cannot grant consent: Verified adult identity and guardian relationship are required'
      );
    }

    const updated = await prisma.consentRecord.update({
      where: { id: consentRecordId },
      data: {
        status: 'GRANTED',
        grantedAt: new Date(),
      },
    });

    eventBus.publish({
      eventId: crypto.randomUUID(),
      type: 'CONSENT_GRANTED',
      schemaVersion: '1.0.0',
      occurredAt: new Date().toISOString(),
      learnerId: record.minorPersonId,
      payload: {
        consentRecordId: updated.id,
        purposes: updated.purposes,
      },
    });

    return updated;
  }

  async revokeConsent(consentRecordId: string, reason?: string) {
    const updated = await prisma.consentRecord.update({
      where: { id: consentRecordId },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
      },
    });

    eventBus.publish({
      eventId: crypto.randomUUID(),
      type: 'CONSENT_REVOKED',
      schemaVersion: '1.0.0',
      occurredAt: new Date().toISOString(),
      learnerId: updated.minorPersonId,
      payload: {
        consentRecordId: updated.id,
        reason,
      },
    });

    return updated;
  }

  async getMinorConsentStatus(minorPersonId: string): Promise<ConsentStatus> {
    const record = await prisma.consentRecord.findFirst({
      where: {
        minorPersonId,
        status: 'GRANTED',
      },
      orderBy: { grantedAt: 'desc' },
    });

    return record ? 'GRANTED' : 'REQUESTED';
  }

  /**
   * Activates minor account only when BOTH verified adult guardian verification AND
   * active granted consent records exist.
   */
  async activateMinorAccountIfEligible(minorPersonId: string): Promise<{ isActivated: boolean; message: string }> {
    const person = await prisma.person.findUnique({
      where: { id: minorPersonId },
      include: { account: true, guardianLinksAsMinor: true },
    });

    if (!person) {
      throw new NotFoundError('Person', minorPersonId);
    }

    if (person.account.status === 'ACTIVATED') {
      return { isActivated: true, message: 'Account is already active' };
    }

    if (person.account.status !== 'REGISTERED_PENDING_CONSENT') {
      throw new ValidationError(`Account cannot be activated from status: ${person.account.status}`);
    }

    if (!person.guardianLinksAsMinor.length) {
      throw new ValidationError('Account activation failed: No linked guardian record found');
    }

    // Verify that a verified case exists
    const verifiedCase = await prisma.guardianVerificationCase.findFirst({
      where: {
        minorPersonId,
        verificationStatus: 'VERIFIED',
        isAdultVerified: true,
        isRelationshipVerified: true,
      },
    });

    if (!verifiedCase) {
      throw new ValidationError(
        'Account activation failed: Lawful guardian adulthood and relationship verification not completed'
      );
    }

    // Verify granted consent exists
    const grantedConsent = await prisma.consentRecord.findFirst({
      where: {
        minorPersonId,
        status: 'GRANTED',
      },
    });

    if (!grantedConsent) {
      throw new ValidationError('Account activation failed: Active guardian consent has not been granted');
    }

    await prisma.account.update({
      where: { id: person.accountId },
      data: { status: 'ACTIVATED' },
    });

    eventBus.publish({
      eventId: crypto.randomUUID(),
      type: 'ACCOUNT_ACTIVATED',
      schemaVersion: '1.0.0',
      occurredAt: new Date().toISOString(),
      learnerId: minorPersonId,
      payload: {
        accountId: person.accountId,
        activatedViaCaseId: verifiedCase.id,
        consentRecordId: grantedConsent.id,
      },
    });

    return { isActivated: true, message: 'Minor account activated successfully' };
  }
}

export const consentService = new ConsentService();
