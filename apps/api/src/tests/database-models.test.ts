import { describe, it, expect, afterAll } from 'vitest';
import { prisma, disconnectDatabase } from '../shared/database/prisma';
import { identityService } from '../modules/identity';
import { organisationService } from '../modules/organisation';
import { academicService } from '../modules/academic';
import { Prisma } from '@prisma/client';

describe('Database Models & Architecture Invariants', () => {
  afterAll(async () => {
    await disconnectDatabase();
  });

  it('CRITICAL: Aadhaar must NOT be a field in any GaonLab database model', () => {
    // Introspect Prisma DMMF models to verify zero occurrence of "aadhaar" (case-insensitive)
    const modelNames = Prisma.dmmf.datamodel.models.map((m) => m.name);
    expect(modelNames.length).toBeGreaterThan(15);

    for (const model of Prisma.dmmf.datamodel.models) {
      for (const field of model.fields) {
        expect(field.name.toLowerCase()).not.toContain('aadhaar');
      }
    }

    // Verify enums
    for (const enumDef of Prisma.dmmf.datamodel.enums) {
      for (const value of enumDef.values) {
        expect(value.name.toLowerCase()).not.toContain('aadhaar');
      }
    }
  });

  it('An independent learner can exist and enroll without any school or organisation', async () => {
    const loginId = `independent_${Date.now()}`;
    const account = await identityService.createAccount({
      loginIdentifier: loginId,
      displayName: 'Independent Rural Learner',
      accountType: 'LEARNER',
      status: 'ACTIVATED',
    });

    const profile = await identityService.createLearnerProfile({
      personId: account.personId,
      learnerCategory: 'MIDDLE',
      approximateAge: 13,
      preferredInterfaceLanguage: 'kn',
      mediumOfInstruction: 'kn',
    });

    expect(profile.personId).toBe(account.personId);

    // Ensure board exists
    await prisma.educationBoard.upsert({
      where: { id: 'KARNATAKA_STATE_BOARD' },
      update: {},
      create: {
        id: 'KARNATAKA_STATE_BOARD',
        code: 'KSEAB',
        name: 'Karnataka School Examination and Assessment Board',
        jurisdiction: 'STATE',
      },
    });

    // Independent learner enrolls without school (organisationId: undefined)
    const enrollment = await academicService.enrollLearner({
      learnerPersonId: account.personId,
      boardId: 'KARNATAKA_STATE_BOARD',
      academicYear: '2026-2027',
      officialGrade: 7,
      primaryMedium: 'kn',
    });

    expect(enrollment.learnerPersonId).toBe(account.personId);
    expect(enrollment.organisationId).toBeNull();
    expect(enrollment.classGroupId).toBeNull();
    expect(enrollment.status).toBe('ACTIVE');
  });

  it('A school-associated learner can be linked to verified school and class group', async () => {
    const org = await organisationService.createOrganisation({
      name: 'Government Higher Primary School Belagavi',
      district: 'Belagavi',
      state: 'Karnataka',
      pincode: '590001',
    });

    const schoolProfile = await organisationService.createSchoolProfile({
      organisationId: org.id,
      udiseCode: `290101${Date.now().toString().slice(-5)}`,
      verificationStatus: 'UDISE_VERIFIED',
      gradesOffered: [6, 7, 8],
      mediumsOffered: ['kn', 'en'],
    });

    const classGroup = await organisationService.createClassGroup({
      schoolProfileId: schoolProfile.id,
      grade: 8,
      section: 'A',
      academicYear: '2026-2027',
    });

    const studentAccount = await identityService.createAccount({
      loginIdentifier: `student_school_${Date.now()}`,
      displayName: 'School Associated Student',
      accountType: 'LEARNER',
      status: 'ACTIVATED',
    });

    // Add membership
    const membership = await organisationService.addMembership({
      organisationId: org.id,
      personId: studentAccount.personId,
      role: 'STUDENT',
      classGroupId: classGroup.id,
    });

    expect(membership.organisationId).toBe(org.id);
    expect(membership.classGroupId).toBe(classGroup.id);

    // Enroll with school
    const enrollment = await academicService.enrollLearner({
      learnerPersonId: studentAccount.personId,
      organisationId: org.id,
      classGroupId: classGroup.id,
      boardId: 'KARNATAKA_STATE_BOARD',
      academicYear: '2026-2027',
      officialGrade: 8,
      primaryMedium: 'kn',
    });

    expect(enrollment.organisationId).toBe(org.id);
    expect(enrollment.classGroupId).toBe(classGroup.id);
  });

  it('APAAR is supported as an optional external identifier, not an authentication credential', async () => {
    const account = await identityService.createAccount({
      loginIdentifier: `apaar_learner_${Date.now()}`,
      displayName: 'APAAR Holder Learner',
      accountType: 'LEARNER',
    });

    const apaarId = `APAAR-${Date.now()}`;
    const externalId = await prisma.externalIdentifier.create({
      data: {
        personId: account.personId,
        type: 'APAAR',
        identifierValue: apaarId,
        verificationStatus: 'VERIFIED',
      },
    });

    expect(externalId.type).toBe('APAAR');
    expect(externalId.identifierValue).toBe(apaarId);

    // Verify account loginIdentifier is independent of APAAR
    const fetchedAccount = await identityService.getAccountById(account.accountId);
    expect(fetchedAccount.loginIdentifier).not.toBe(apaarId);
  });
});
