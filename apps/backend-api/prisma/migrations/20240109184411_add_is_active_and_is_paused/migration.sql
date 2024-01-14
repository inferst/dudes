-- AlterTable
ALTER TABLE "Reward" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPaused" BOOLEAN NOT NULL DEFAULT false;
