/**
 * Consent and Guardianship Contracts
 * DPDP Act 2023 Compliant Minor Protection Models
 */

export type ConsentStatus = 'REQUESTED' | 'GRANTED' | 'REVOKED' | 'EXPIRED';

export type ConsentPurpose =
  | 'BASIC_LEARNING'
  | 'OFFLINE_SYNC'
  | 'ACADEMIC_HISTORY_TRACKING'
  | 'COLLABORATIVE_MISSIONS'
  | 'EXTERNAL_OPPORTUNITIES';

export type GuardianRelationType =
  | 'MOTHER'
  | 'FATHER'
  | 'LEGAL_GUARDIAN'
  | 'INSTITUTIONAL_WARDEN'
  | 'TEACHER_IN_LOCO_PARENTIS';

export type VerificationMethod =
  | 'MOCK_MANUAL_DEV'                  // Explicitly for local development testing
  | 'MULTI_FACTOR_TOKEN_DECLARATION'   // Decoupled cryptographic link + adult declaration
  | 'AUDIO_IVR_CONFIRMATION'           // Interactive voice response in regional language
  | 'TEACHER_ATTESTED_PHYSICAL'        // Headmaster / Teacher validated physical consent
  | 'DIGITAL_LOCKER_DELEGATION';       // Future DigiLocker guardian consent delegation

export type GuardianVerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'FAILED'
  | 'REVOKED';

export interface ConsentPolicy {
  id: string;
  version: string;
  title: string;
  content: string;
  effectiveFrom: string;
  effectiveTo?: string;
  isCurrent: boolean;
}

export interface ConsentRecord {
  id: string;
  minorPersonId: string;
  guardianPersonId: string;
  policyId: string;
  purposes: ConsentPurpose[];
  status: ConsentStatus;
  grantedAt?: string;
  revokedAt?: string;
  expiresAt?: string;
  verificationCaseId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Guardian Verification Contract
 * Decouples legal adult verification from simple phone OTP receipt.
 */
export interface GuardianVerificationCase {
  id: string;
  guardianPersonId: string;
  minorPersonId: string;
  verificationMethod: VerificationMethod;
  verificationStatus: GuardianVerificationStatus;
  isPhoneVerified: boolean;
  isAdultVerified: boolean;
  isRelationshipVerified: boolean;
  isMockVerification: boolean;
  providerReference?: string;
  evidenceMetadata?: Record<string, unknown>;
  verifiedAt?: string;
  verifiedByActorId?: string; // e.g. Teacher or System Admin ID for physical attestation
  createdAt: string;
  updatedAt: string;
}

export interface VerificationEvidence {
  providerId: string;
  isMock: boolean;
  phoneVerified: boolean;
  adultVerified: boolean;
  relationshipVerified: boolean;
  evidenceType: string;
  evidenceReference?: string;
  verifiedByActorId?: string;
  metadata?: Record<string, unknown>;
}

export interface IGuardianVerificationProvider {
  providerId: string;
  isProductionReady: boolean;
  verifyGuardian(caseId: string, params: Record<string, unknown>): Promise<VerificationEvidence>;
}
