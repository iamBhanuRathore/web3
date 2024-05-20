/*
  Warnings:

  - You are about to alter the column `balanceAmount` on the `Balance` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,10)` to `Integer`.
  - You are about to alter the column `pendingAmount` on the `Balance` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,10)` to `Integer`.
  - You are about to alter the column `lockedAmount` on the `Balance` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,10)` to `Integer`.
  - You are about to alter the column `amount` on the `Submission` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,10)` to `Integer`.
  - You are about to alter the column `amount` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,10)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Balance" ALTER COLUMN "balanceAmount" SET DEFAULT 0,
ALTER COLUMN "balanceAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "pendingAmount" SET DEFAULT 0,
ALTER COLUMN "pendingAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "lockedAmount" SET DEFAULT 0,
ALTER COLUMN "lockedAmount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE INTEGER;
