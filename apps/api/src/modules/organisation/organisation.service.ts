import { prisma } from '../../shared/database/prisma';
import { ConflictError, NotFoundError } from '../../shared/errors';
import { eventBus } from '../../shared/events';
import {
  AddMembershipInput,
  CreateClassGroupInput,
  CreateOrganisationInput,
  CreateSchoolProfileInput,
  IOrganisationService,
} from './organisation.contracts';

export class OrganisationService implements IOrganisationService {
  async createOrganisation(input: CreateOrganisationInput) {
    return prisma.organisation.create({
      data: {
        name: input.name,
        type: input.type || 'SCHOOL',
        district: input.district,
        state: input.state,
        pincode: input.pincode,
        isActive: true,
      },
    });
  }

  async createSchoolProfile(input: CreateSchoolProfileInput) {
    if (input.udiseCode) {
      const existing = await prisma.schoolProfile.findUnique({
        where: { udiseCode: input.udiseCode },
      });
      if (existing) {
        throw new ConflictError(`School with UDISE code '${input.udiseCode}' already exists`);
      }
    }

    const profile = await prisma.schoolProfile.create({
      data: {
        organisationId: input.organisationId,
        udiseCode: input.udiseCode,
        verificationStatus: input.verificationStatus || 'SELF_DECLARED',
        managementCategory: input.managementCategory,
        mediumsOffered: (input.mediumsOffered || ['en']) as any,
        gradesOffered: (input.gradesOffered || [6, 7, 8]) as any,
      },
    });

    eventBus.publish({
      eventId: crypto.randomUUID(),
      type: 'SCHOOL_PROFILE_CREATED',
      schemaVersion: '1.0.0',
      occurredAt: new Date().toISOString(),
      payload: {
        organisationId: input.organisationId,
        udiseCode: input.udiseCode,
        verificationStatus: profile.verificationStatus,
      },
    });

    return profile;
  }

  async createClassGroup(input: CreateClassGroupInput) {
    return prisma.classGroup.create({
      data: {
        schoolProfileId: input.schoolProfileId,
        grade: input.grade,
        section: input.section,
        academicYear: input.academicYear || '2026-2027',
        isActive: true,
      },
    });
  }

  async addMembership(input: AddMembershipInput) {
    return prisma.membership.create({
      data: {
        organisationId: input.organisationId,
        personId: input.personId,
        role: input.role,
        classGroupId: input.classGroupId,
        isActive: true,
      },
    });
  }

  async getSchoolByUdise(udiseCode: string) {
    const school = await prisma.schoolProfile.findUnique({
      where: { udiseCode },
      include: { organisation: true },
    });
    if (!school) {
      throw new NotFoundError('School with UDISE code', udiseCode);
    }
    return school;
  }

  async getOrganisationById(id: string) {
    const org = await prisma.organisation.findUnique({
      where: { id },
      include: { schoolProfile: true },
    });
    if (!org) {
      throw new NotFoundError('Organisation', id);
    }
    return org;
  }
}

export const organisationService = new OrganisationService();
