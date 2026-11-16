/**
 * Organisation & School Domain Contracts
 */

export type OrganisationType =
  | 'SCHOOL'
  | 'CLUSTER_RESOURCE_CENTRE'
  | 'BLOCK_EDUCATION_OFFICE'
  | 'COMMUNITY_LEARNING_CENTRE'
  | 'PLATFORM_OPERATOR';

export type SchoolVerificationStatus =
  | 'SELF_DECLARED'        // Registered by user/teacher without verification
  | 'UDISE_VERIFIED'       // Matched against official UDISE+ master reference
  | 'DEPARTMENT_AFFILIATED'// Formally onboarded via state department / district MoU
  | 'REJECTED';

export type MembershipRole =
  | 'STUDENT'
  | 'TEACHER'
  | 'HEADMASTER'
  | 'SCHOOL_ADMIN'
  | 'EXTERNAL_MENTOR';

export interface Organisation {
  id: string; // UUID v4
  name: string;
  type: OrganisationType;
  district?: string;
  state?: string;
  pincode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolProfile {
  id: string;
  organisationId: string;
  udiseCode?: string; // Optional 11-digit national school code
  verificationStatus: SchoolVerificationStatus;
  managementCategory?: string; // e.g. "Department of Education", "Private Aided"
  mediumsOffered: string[];
  gradesOffered: number[];
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassGroup {
  id: string;
  schoolProfileId: string;
  grade: number; // e.g. 6, 7, 8
  section: string; // e.g. "A", "B", "Kannada Medium"
  academicYear: string; // e.g. "2026-2027"
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  organisationId: string;
  personId: string;
  role: MembershipRole;
  classGroupId?: string; // Optional (e.g. for students/teachers bound to a specific class)
  isActive: boolean;
  joinedAt: string;
  leftAt?: string;
  createdAt: string;
  updatedAt: string;
}
