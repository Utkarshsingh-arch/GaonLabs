import { AccountStatus, AccountType, LearnerCategory, SupportedLanguage } from '@gaonlab/shared-types';

export interface CreateAccountInput {
  loginIdentifier: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  accountType?: AccountType;
  status?: AccountStatus;
  displayName: string;
  preferredLanguage?: SupportedLanguage;
}

export interface CreateLearnerProfileInput {
  personId: string;
  learnerCategory?: LearnerCategory;
  dateOfBirth?: Date;
  approximateAge?: number;
  preferredInterfaceLanguage?: SupportedLanguage;
  mediumOfInstruction?: SupportedLanguage;
  learningPreferences?: Record<string, unknown>;
  accessibilityPreferences?: Record<string, unknown>;
}

export interface LinkGuardianInput {
  minorPersonId: string;
  guardianPersonId: string;
  relationshipType: 'MOTHER' | 'FATHER' | 'LEGAL_GUARDIAN' | 'INSTITUTIONAL_WARDEN' | 'TEACHER_IN_LOCO_PARENTIS';
  isPrimary?: boolean;
}

export interface IIdentityService {
  createAccount(input: CreateAccountInput): Promise<{ accountId: string; personId: string }>;
  getAccountById(accountId: string): Promise<any>;
  getPersonById(personId: string): Promise<any>;
  createLearnerProfile(input: CreateLearnerProfileInput): Promise<any>;
  linkGuardian(input: LinkGuardianInput): Promise<any>;
  updateAccountStatus(accountId: string, status: AccountStatus): Promise<void>;
}
