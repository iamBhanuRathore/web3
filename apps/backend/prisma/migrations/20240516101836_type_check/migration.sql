/*
  Warnings:

  - You are about to drop the column `acrive` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "acrive",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
