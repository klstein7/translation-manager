/*
  Warnings:

  - You are about to drop the column `domainId` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `sourceText` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `translatedText` on the `Translation` table. All the data in the column will be lost.
  - Added the required column `text` to the `Translation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_domainId_fkey";

-- DropIndex
DROP INDEX "Translation_key_key";

-- AlterTable
ALTER TABLE "Translation" DROP COLUMN "domainId",
DROP COLUMN "key",
DROP COLUMN "sourceText",
DROP COLUMN "translatedText",
ADD COLUMN     "text" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "domainId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Source_key_key" ON "Source"("key");

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
