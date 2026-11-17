import {
  MembershipRole,
  OrganisationType,
  SchoolVerificationStatus,
} from '@gaonlab/shared-types';

export interface CreateOrganisationInput {
  name: string;
  type?: OrganisationType;
  district?: string;
  state?: string;
  pincode?: string;
}

export interface CreateSchoolProfileInput {
  organisationId: string;
  udiseCode?: string;
  verificationStatus?: SchoolVerificationStatus;
  managementCategory?: string;
  mediumsOffered?: string[];
  gradesOffered?: number[];
}

export interface CreateClassGroupInput {
  schoolProfileId: string;
  grade: number;
  section: string;
  academicYear?: string;
}

export interface AddMembershipInput {
  organisationId: string;
  personId: string;
  role: MembershipRole;
  classGroupId?: string;
}

export interface IOrganisationService {
  createOrganisation(input: CreateOrganisationInput): Promise<any>;
  createSchoolProfile(input: CreateSchoolProfileInput): Promise<any>;
  createClassGroup(input: CreateClassGroupInput): Promise<any>;
  addMembership(input: AddMembershipInput): Promise<any>;
  getSchoolByUdise(udiseCode: string): Promise<any>;
  getOrganisationById(id: string): Promise<any>;
}
