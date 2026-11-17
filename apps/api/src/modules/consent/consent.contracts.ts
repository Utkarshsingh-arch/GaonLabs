import {
  ConsentPurpose,
  ConsentStatus,
  GuardianVerificationStatus,
  IGuardianVerificationProvider,
  VerificationEvidence,
  VerificationMethod,
} from '@gaonlab/shared-types';

export interface CreateConsentPolicyInput {
  version: string;
  title: string;
  content: string;
  effectiveFrom?: Date;
  effectiveTo?: Date;
}

export interface RequestGuardianConsentInput {
  minorPersonId: string;
  guardianPersonId: string;
  policyId: string;
  purposes: ConsentPurpose[];
  verificationMethod: VerificationMethod;
}

export interface VerifyGuardianInput {
  verificationCaseId: string;
  methodUsed: VerificationMethod;
  isAdultDeclared: boolean;
  phoneVerified?: boolean;
  adultVerified?: boolean;
  relationshipVerified?: boolean;
  providerReference?: string;
  evidenceMetadata?: Record<string, unknown>;
  verifiedByActorId?: string;
}

export interface IConsentService {
  createPolicy(input: CreateConsentPolicyInput): Promise<any>;
  getActivePolicy(): Promise<any>;
  requestGuardianConsent(input: RequestGuardianConsentInput): Promise<{ consentRecordId: string; verificationCaseId: string }>;
  verifyGuardian(input: VerifyGuardianInput): Promise<{ isVerified: boolean; verificationStatus: GuardianVerificationStatus }>;
  grantConsent(consentRecordId: string): Promise<any>;
  revokeConsent(consentRecordId: string, reason?: string): Promise<any>;
  getMinorConsentStatus(minorPersonId: string): Promise<ConsentStatus>;
  activateMinorAccountIfEligible(minorPersonId: string): Promise<{ isActivated: boolean; message: string }>;
}

export type { IGuardianVerificationProvider, VerificationEvidence };
