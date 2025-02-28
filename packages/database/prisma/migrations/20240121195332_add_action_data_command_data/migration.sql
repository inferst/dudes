-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}';
