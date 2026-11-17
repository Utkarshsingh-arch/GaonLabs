-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "pageEnd" INTEGER,
ADD COLUMN     "pageStart" INTEGER,
ADD COLUMN     "sourceUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Textbook_publisherId_subjectId_levelId_canonicalTitle_key" ON "Textbook"("publisherId", "subjectId", "levelId", "canonicalTitle");
