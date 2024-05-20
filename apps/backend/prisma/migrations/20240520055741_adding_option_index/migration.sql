/*
  Warnings:

  - You are about to drop the column `optionId` on the `Options` table. All the data in the column will be lost.
  - You are about to drop the column `optionsId` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `optionIndex` to the `Options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_optionsId_fkey";

-- AlterTable
ALTER TABLE "Options" DROP COLUMN "optionId",
ADD COLUMN     "optionIndex" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "optionsId",
ADD COLUMN     "optionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
