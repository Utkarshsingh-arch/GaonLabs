/**
 * Identity & Person Domain Contracts
 */

import { AccountStatus, LearnerCategory, SupportedLanguage } from './learner-context';
import { GuardianRelationType } from './consent';

export type AccountType =
  | 'LEARNER'
  | 'GUARDIAN'
  | 'TEACHER'
  | 'SCHOOL_ADMIN'
  | 'PLATFORM_ADMIN';

export type ExternalIdentifierType =
  | 'APAAR'                 // Optional academic ID under NEP 2020 (Not for authentication)
  | 'STATE_STUDENT_ID'     // e.g. Karnataka SATS Student ID
  | 'PEN'                   // Permanent Education Number
  | 'UDISE_STUDENT_CODE';  // Internal school student code
  // CRITICAL ARCHITECTURAL DIRECTIVE: AADHAAR MUST NEVER BE INCLUDED HERE

export type IdentifierVerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'REJECTED';

export interface Account {
  id: string; // UUID v4
  loginIdentifier: string; // Unique username or system-generated ID
  email?: string; // Optional, normalized
  phone?: string; // Optional, normalized
  passwordHash?: string; // Optional when using password auth
  status: AccountStatus;
  accountType: AccountType;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string; // UUID v4
  accountId: string; // 1:1 binding to Account
  displayName: string;
  preferredLanguage: SupportedLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface LearnerProfile {
  id: string;
  personId: string;
  learnerCategory: LearnerCategory;
  dateOfBirth?: string; // ISO 8601 YYYY-MM-DD
  approximateAge?: number; // Protected age info if DOB unavailable
  preferredInterfaceLanguage: SupportedLanguage;
  mediumOfInstruction: SupportedLanguage;
  learningPreferences?: Record<string, unknown>;
  accessibilityPreferences?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GuardianLink {
  id: string;
  minorPersonId: string;
  guardianPersonId: string;
  relationshipType: GuardianRelationType;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalIdentifier {
  id: string;
  personId: string;
  type: ExternalIdentifierType;
  identifierValue: string;
  verificationStatus: IdentifierVerificationStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
