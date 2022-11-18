/*
  Warnings:

  - Added the required column `sourceId` to the `Translation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "sourceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
