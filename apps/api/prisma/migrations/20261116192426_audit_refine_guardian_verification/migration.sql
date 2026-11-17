-- AlterTable
ALTER TABLE "GuardianVerificationCase" ADD COLUMN     "isAdultVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMockVerification" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRelationshipVerified" BOOLEAN NOT NULL DEFAULT false;
