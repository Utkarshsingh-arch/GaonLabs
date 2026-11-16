-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('REGISTERED_PENDING_CONSENT', 'ACTIVATED', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('LEARNER', 'GUARDIAN', 'TEACHER', 'SCHOOL_ADMIN', 'PLATFORM_ADMIN');

-- CreateEnum
CREATE TYPE "LearnerCategory" AS ENUM ('PRIMARY', 'MIDDLE', 'SECONDARY', 'POST_SCHOOL');

-- CreateEnum
CREATE TYPE "ExternalIdentifierType" AS ENUM ('APAAR', 'STATE_STUDENT_ID', 'PEN', 'UDISE_STUDENT_CODE');

-- CreateEnum
CREATE TYPE "IdentifierVerificationStatus" AS ENUM ('UNVERIFIED', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "GuardianRelationType" AS ENUM ('MOTHER', 'FATHER', 'LEGAL_GUARDIAN', 'INSTITUTIONAL_WARDEN', 'TEACHER_IN_LOCO_PARENTIS');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('REQUESTED', 'GRANTED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "VerificationMethod" AS ENUM ('MOCK_MANUAL_DEV', 'MULTI_FACTOR_TOKEN_DECLARATION', 'AUDIO_IVR_CONFIRMATION', 'TEACHER_ATTESTED_PHYSICAL', 'DIGITAL_LOCKER_DELEGATION');

-- CreateEnum
CREATE TYPE "GuardianVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'REVOKED');

-- CreateEnum
CREATE TYPE "OrganisationType" AS ENUM ('SCHOOL', 'CLUSTER_RESOURCE_CENTRE', 'BLOCK_EDUCATION_OFFICE', 'COMMUNITY_LEARNING_CENTRE', 'PLATFORM_OPERATOR');

-- CreateEnum
CREATE TYPE "SchoolVerificationStatus" AS ENUM ('SELF_DECLARED', 'UDISE_VERIFIED', 'DEPARTMENT_AFFILIATED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('STUDENT', 'TEACHER', 'HEADMASTER', 'SCHOOL_ADMIN', 'EXTERNAL_MENTOR');

-- CreateEnum
CREATE TYPE "CurriculumStatus" AS ENUM ('DRAFT', 'PENDING_VERIFICATION', 'VERIFIED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'WITHDRAWN', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "GovAdapterMode" AS ENUM ('LIVE', 'CACHED', 'MOCK', 'OFF');

-- CreateEnum
CREATE TYPE "GovernmentProviderCode" AS ENUM ('NDEAR', 'DIKSHA', 'APAAR', 'BHASHINI', 'PARAKH', 'UDISE_PLUS', 'KTBS', 'DSERT', 'KSEAB', 'KARNATAKA_SATS', 'VIDYA_SAMIKSHA_KENDRA');

-- CreateEnum
CREATE TYPE "AuditActionCategory" AS ENUM ('ACCOUNT', 'CONSENT', 'GUARDIAN_VERIFICATION', 'SCHOOL_VERIFICATION', 'ENROLLMENT', 'CURRICULUM_MUTATION', 'INTEGRATION_STATUS_CHANGE', 'SECURITY_EVENT');

-- CreateEnum
CREATE TYPE "SyncRecordStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'REJECTED', 'DUPLICATE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "loginIdentifier" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'REGISTERED_PENDING_CONSENT',
    "accountType" "AccountType" NOT NULL DEFAULT 'LEARNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnerProfile" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "learnerCategory" "LearnerCategory" NOT NULL DEFAULT 'MIDDLE',
    "dateOfBirth" TIMESTAMP(3),
    "approximateAge" INTEGER,
    "preferredInterfaceLanguage" TEXT NOT NULL DEFAULT 'en',
    "mediumOfInstruction" TEXT NOT NULL DEFAULT 'en',
    "learningPreferences" JSONB,
    "accessibilityPreferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianLink" (
    "id" TEXT NOT NULL,
    "minorPersonId" TEXT NOT NULL,
    "guardianPersonId" TEXT NOT NULL,
    "relationshipType" "GuardianRelationType" NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuardianLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalIdentifier" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "type" "ExternalIdentifierType" NOT NULL,
    "identifierValue" TEXT NOT NULL,
    "verificationStatus" "IdentifierVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalIdentifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentPolicy" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "minorPersonId" TEXT NOT NULL,
    "guardianPersonId" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "purposes" JSONB NOT NULL,
    "status" "ConsentStatus" NOT NULL DEFAULT 'REQUESTED',
    "grantedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "verificationCaseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianVerificationCase" (
    "id" TEXT NOT NULL,
    "guardianPersonId" TEXT NOT NULL,
    "minorPersonId" TEXT NOT NULL,
    "verificationMethod" "VerificationMethod" NOT NULL DEFAULT 'MULTI_FACTOR_TOKEN_DECLARATION',
    "verificationStatus" "GuardianVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "providerReference" TEXT,
    "evidenceMetadata" JSONB,
    "verifiedAt" TIMESTAMP(3),
    "verifiedByActorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuardianVerificationCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrganisationType" NOT NULL DEFAULT 'SCHOOL',
    "district" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolProfile" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "udiseCode" TEXT,
    "verificationStatus" "SchoolVerificationStatus" NOT NULL DEFAULT 'SELF_DECLARED',
    "managementCategory" TEXT,
    "mediumsOffered" JSONB NOT NULL,
    "gradesOffered" JSONB NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassGroup" (
    "id" TEXT NOT NULL,
    "schoolProfileId" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "section" TEXT NOT NULL DEFAULT 'A',
    "academicYear" TEXT NOT NULL DEFAULT '2026-2027',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'STUDENT',
    "classGroupId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationBoard" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL DEFAULT 'STATE',
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumFramework" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adoptingAuthority" TEXT NOT NULL,
    "yearIntroduced" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumFramework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumAuthority" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "officialUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumAuthority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextbookPublisher" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "officialCatalogUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextbookPublisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "numericGrade" INTEGER NOT NULL,
    "stage" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stemPillar" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumVersion" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "frameworkId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL DEFAULT '2026-2027',
    "medium" TEXT NOT NULL DEFAULT 'en',
    "status" "CurriculumStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "versionLabel" TEXT NOT NULL,
    "sourceReferenceUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedByActorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Textbook" (
    "id" TEXT NOT NULL,
    "publisherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "canonicalTitle" TEXT NOT NULL,
    "isbn" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Textbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextbookEdition" (
    "id" TEXT NOT NULL,
    "textbookId" TEXT NOT NULL,
    "editionNumber" INTEGER NOT NULL DEFAULT 1,
    "publicationYear" INTEGER NOT NULL DEFAULT 2026,
    "medium" TEXT NOT NULL DEFAULT 'en',
    "titleInLanguage" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "licenceInfo" TEXT,
    "status" "CurriculumStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "totalChapters" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextbookEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumTextbook" (
    "id" TEXT NOT NULL,
    "curriculumVersionId" TEXT NOT NULL,
    "textbookEditionId" TEXT NOT NULL,
    "isPrescribed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurriculumTextbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "textbookEditionId" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "officialCode" TEXT,
    "status" "CurriculumStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "summaryNotes" TEXT,
    "dikshaQrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningOutcome" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "competencyPillar" TEXT NOT NULL,
    "parakhStandardRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicEnrollment" (
    "id" TEXT NOT NULL,
    "learnerPersonId" TEXT NOT NULL,
    "organisationId" TEXT,
    "classGroupId" TEXT,
    "boardId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL DEFAULT '2026-2027',
    "officialGrade" INTEGER NOT NULL,
    "primaryMedium" TEXT NOT NULL DEFAULT 'en',
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrollmentSubject" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "curriculumVersionId" TEXT NOT NULL,
    "prescribedEditionId" TEXT,
    "effectiveLevelGrade" INTEGER NOT NULL,
    "isRemedialTrack" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnrollmentSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationProvider" (
    "id" TEXT NOT NULL,
    "code" "GovernmentProviderCode" NOT NULL,
    "name" TEXT NOT NULL,
    "officialPortalUrl" TEXT NOT NULL,
    "operationalMode" "GovAdapterMode" NOT NULL DEFAULT 'MOCK',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderCapability" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "capabilityKey" TEXT NOT NULL,
    "isSupported" BOOLEAN NOT NULL DEFAULT true,
    "requiresAuth" BOOLEAN NOT NULL DEFAULT false,
    "fallbackStrategy" TEXT NOT NULL DEFAULT 'LOCAL_CACHE',
    "metadataConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "actorAccountId" TEXT,
    "category" "AuditActionCategory" NOT NULL,
    "action" TEXT NOT NULL,
    "targetResourceType" TEXT NOT NULL,
    "targetResourceId" TEXT NOT NULL,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncDevice" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "accountPersonId" TEXT NOT NULL,
    "deviceModel" TEXT,
    "osVersion" TEXT,
    "appVersion" TEXT,
    "lastSyncAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncEventRecord" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "learnerPersonId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "status" "SyncRecordStatus" NOT NULL DEFAULT 'RECEIVED',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "SyncEventRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isEnabledGlobally" BOOLEAN NOT NULL DEFAULT false,
    "enabledEnvironments" JSONB NOT NULL,
    "allowedCategories" JSONB NOT NULL,
    "allowedOrganisations" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_loginIdentifier_key" ON "Account"("loginIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE INDEX "Account_status_idx" ON "Account"("status");

-- CreateIndex
CREATE INDEX "Account_accountType_idx" ON "Account"("accountType");

-- CreateIndex
CREATE UNIQUE INDEX "Person_accountId_key" ON "Person"("accountId");

-- CreateIndex
CREATE INDEX "Person_displayName_idx" ON "Person"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "LearnerProfile_personId_key" ON "LearnerProfile"("personId");

-- CreateIndex
CREATE INDEX "LearnerProfile_learnerCategory_idx" ON "LearnerProfile"("learnerCategory");

-- CreateIndex
CREATE INDEX "LearnerProfile_preferredInterfaceLanguage_idx" ON "LearnerProfile"("preferredInterfaceLanguage");

-- CreateIndex
CREATE INDEX "LearnerProfile_mediumOfInstruction_idx" ON "LearnerProfile"("mediumOfInstruction");

-- CreateIndex
CREATE INDEX "GuardianLink_minorPersonId_idx" ON "GuardianLink"("minorPersonId");

-- CreateIndex
CREATE INDEX "GuardianLink_guardianPersonId_idx" ON "GuardianLink"("guardianPersonId");

-- CreateIndex
CREATE UNIQUE INDEX "GuardianLink_minorPersonId_guardianPersonId_key" ON "GuardianLink"("minorPersonId", "guardianPersonId");

-- CreateIndex
CREATE INDEX "ExternalIdentifier_personId_idx" ON "ExternalIdentifier"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIdentifier_type_identifierValue_key" ON "ExternalIdentifier"("type", "identifierValue");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentPolicy_version_key" ON "ConsentPolicy"("version");

-- CreateIndex
CREATE INDEX "ConsentRecord_minorPersonId_idx" ON "ConsentRecord"("minorPersonId");

-- CreateIndex
CREATE INDEX "ConsentRecord_guardianPersonId_idx" ON "ConsentRecord"("guardianPersonId");

-- CreateIndex
CREATE INDEX "ConsentRecord_status_idx" ON "ConsentRecord"("status");

-- CreateIndex
CREATE INDEX "GuardianVerificationCase_guardianPersonId_idx" ON "GuardianVerificationCase"("guardianPersonId");

-- CreateIndex
CREATE INDEX "GuardianVerificationCase_minorPersonId_idx" ON "GuardianVerificationCase"("minorPersonId");

-- CreateIndex
CREATE INDEX "GuardianVerificationCase_verificationStatus_idx" ON "GuardianVerificationCase"("verificationStatus");

-- CreateIndex
CREATE INDEX "Organisation_name_idx" ON "Organisation"("name");

-- CreateIndex
CREATE INDEX "Organisation_state_district_idx" ON "Organisation"("state", "district");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolProfile_organisationId_key" ON "SchoolProfile"("organisationId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolProfile_udiseCode_key" ON "SchoolProfile"("udiseCode");

-- CreateIndex
CREATE INDEX "SchoolProfile_udiseCode_idx" ON "SchoolProfile"("udiseCode");

-- CreateIndex
CREATE INDEX "SchoolProfile_verificationStatus_idx" ON "SchoolProfile"("verificationStatus");

-- CreateIndex
CREATE INDEX "ClassGroup_grade_academicYear_idx" ON "ClassGroup"("grade", "academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "ClassGroup_schoolProfileId_grade_section_academicYear_key" ON "ClassGroup"("schoolProfileId", "grade", "section", "academicYear");

-- CreateIndex
CREATE INDEX "Membership_personId_idx" ON "Membership"("personId");

-- CreateIndex
CREATE INDEX "Membership_organisationId_idx" ON "Membership"("organisationId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_organisationId_personId_role_key" ON "Membership"("organisationId", "personId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "EducationBoard_code_key" ON "EducationBoard"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumFramework_code_key" ON "CurriculumFramework"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumAuthority_code_key" ON "CurriculumAuthority"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TextbookPublisher_code_key" ON "TextbookPublisher"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Programme_code_key" ON "Programme"("code");

-- CreateIndex
CREATE INDEX "Level_numericGrade_idx" ON "Level"("numericGrade");

-- CreateIndex
CREATE UNIQUE INDEX "Level_programmeId_numericGrade_key" ON "Level"("programmeId", "numericGrade");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE INDEX "CurriculumVersion_status_idx" ON "CurriculumVersion"("status");

-- CreateIndex
CREATE INDEX "CurriculumVersion_academicYear_idx" ON "CurriculumVersion"("academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumVersion_boardId_frameworkId_levelId_subjectId_aca_key" ON "CurriculumVersion"("boardId", "frameworkId", "levelId", "subjectId", "academicYear", "medium");

-- CreateIndex
CREATE INDEX "Textbook_canonicalTitle_idx" ON "Textbook"("canonicalTitle");

-- CreateIndex
CREATE INDEX "TextbookEdition_status_idx" ON "TextbookEdition"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TextbookEdition_textbookId_editionNumber_medium_key" ON "TextbookEdition"("textbookId", "editionNumber", "medium");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumTextbook_curriculumVersionId_textbookEditionId_key" ON "CurriculumTextbook"("curriculumVersionId", "textbookEditionId");

-- CreateIndex
CREATE INDEX "Chapter_dikshaQrCode_idx" ON "Chapter"("dikshaQrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_textbookEditionId_chapterNumber_key" ON "Chapter"("textbookEditionId", "chapterNumber");

-- CreateIndex
CREATE INDEX "LearningOutcome_chapterId_idx" ON "LearningOutcome"("chapterId");

-- CreateIndex
CREATE INDEX "LearningOutcome_code_idx" ON "LearningOutcome"("code");

-- CreateIndex
CREATE INDEX "AcademicEnrollment_learnerPersonId_idx" ON "AcademicEnrollment"("learnerPersonId");

-- CreateIndex
CREATE INDEX "AcademicEnrollment_academicYear_officialGrade_idx" ON "AcademicEnrollment"("academicYear", "officialGrade");

-- CreateIndex
CREATE INDEX "AcademicEnrollment_status_idx" ON "AcademicEnrollment"("status");

-- CreateIndex
CREATE INDEX "EnrollmentSubject_enrollmentId_idx" ON "EnrollmentSubject"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "EnrollmentSubject_enrollmentId_subjectId_key" ON "EnrollmentSubject"("enrollmentId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationProvider_code_key" ON "IntegrationProvider"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderCapability_providerId_capabilityKey_key" ON "ProviderCapability"("providerId", "capabilityKey");

-- CreateIndex
CREATE INDEX "AuditEvent_category_idx" ON "AuditEvent"("category");

-- CreateIndex
CREATE INDEX "AuditEvent_action_idx" ON "AuditEvent"("action");

-- CreateIndex
CREATE INDEX "AuditEvent_targetResourceType_targetResourceId_idx" ON "AuditEvent"("targetResourceType", "targetResourceId");

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SyncDevice_deviceId_key" ON "SyncDevice"("deviceId");

-- CreateIndex
CREATE INDEX "SyncDevice_accountPersonId_idx" ON "SyncDevice"("accountPersonId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncEventRecord_eventId_key" ON "SyncEventRecord"("eventId");

-- CreateIndex
CREATE INDEX "SyncEventRecord_learnerPersonId_idx" ON "SyncEventRecord"("learnerPersonId");

-- CreateIndex
CREATE INDEX "SyncEventRecord_status_idx" ON "SyncEventRecord"("status");

-- CreateIndex
CREATE INDEX "SyncEventRecord_receivedAt_idx" ON "SyncEventRecord"("receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "FeatureFlag"("key");

-- CreateIndex
CREATE INDEX "FeatureFlag_key_idx" ON "FeatureFlag"("key");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerProfile" ADD CONSTRAINT "LearnerProfile_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianLink" ADD CONSTRAINT "GuardianLink_minorPersonId_fkey" FOREIGN KEY ("minorPersonId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianLink" ADD CONSTRAINT "GuardianLink_guardianPersonId_fkey" FOREIGN KEY ("guardianPersonId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalIdentifier" ADD CONSTRAINT "ExternalIdentifier_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "ConsentPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_verificationCaseId_fkey" FOREIGN KEY ("verificationCaseId") REFERENCES "GuardianVerificationCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolProfile" ADD CONSTRAINT "SchoolProfile_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassGroup" ADD CONSTRAINT "ClassGroup_schoolProfileId_fkey" FOREIGN KEY ("schoolProfileId") REFERENCES "SchoolProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_classGroupId_fkey" FOREIGN KEY ("classGroupId") REFERENCES "ClassGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumVersion" ADD CONSTRAINT "CurriculumVersion_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "EducationBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumVersion" ADD CONSTRAINT "CurriculumVersion_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "CurriculumFramework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumVersion" ADD CONSTRAINT "CurriculumVersion_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumVersion" ADD CONSTRAINT "CurriculumVersion_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Textbook" ADD CONSTRAINT "Textbook_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "TextbookPublisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Textbook" ADD CONSTRAINT "Textbook_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Textbook" ADD CONSTRAINT "Textbook_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextbookEdition" ADD CONSTRAINT "TextbookEdition_textbookId_fkey" FOREIGN KEY ("textbookId") REFERENCES "Textbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumTextbook" ADD CONSTRAINT "CurriculumTextbook_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "CurriculumVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumTextbook" ADD CONSTRAINT "CurriculumTextbook_textbookEditionId_fkey" FOREIGN KEY ("textbookEditionId") REFERENCES "TextbookEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_textbookEditionId_fkey" FOREIGN KEY ("textbookEditionId") REFERENCES "TextbookEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningOutcome" ADD CONSTRAINT "LearningOutcome_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicEnrollment" ADD CONSTRAINT "AcademicEnrollment_learnerPersonId_fkey" FOREIGN KEY ("learnerPersonId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicEnrollment" ADD CONSTRAINT "AcademicEnrollment_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicEnrollment" ADD CONSTRAINT "AcademicEnrollment_classGroupId_fkey" FOREIGN KEY ("classGroupId") REFERENCES "ClassGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicEnrollment" ADD CONSTRAINT "AcademicEnrollment_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "EducationBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentSubject" ADD CONSTRAINT "EnrollmentSubject_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "AcademicEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentSubject" ADD CONSTRAINT "EnrollmentSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentSubject" ADD CONSTRAINT "EnrollmentSubject_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "CurriculumVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentSubject" ADD CONSTRAINT "EnrollmentSubject_prescribedEditionId_fkey" FOREIGN KEY ("prescribedEditionId") REFERENCES "TextbookEdition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCapability" ADD CONSTRAINT "ProviderCapability_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "IntegrationProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorAccountId_fkey" FOREIGN KEY ("actorAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncDevice" ADD CONSTRAINT "SyncDevice_accountPersonId_fkey" FOREIGN KEY ("accountPersonId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncEventRecord" ADD CONSTRAINT "SyncEventRecord_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "SyncDevice"("deviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncEventRecord" ADD CONSTRAINT "SyncEventRecord_learnerPersonId_fkey" FOREIGN KEY ("learnerPersonId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
