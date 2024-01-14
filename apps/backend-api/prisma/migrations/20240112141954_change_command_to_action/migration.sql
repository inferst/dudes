/*
  Warnings:

  - You are about to drop the column `description` on the `Command` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Command` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Command` table. All the data in the column will be lost.
  - You are about to drop the column `commandId` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the `UserCommand` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `actionId` to the `Command` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Command` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Command` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actionId` to the `Reward` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_commandId_fkey";

-- DropForeignKey
ALTER TABLE "UserCommand" DROP CONSTRAINT "UserCommand_commandId_fkey";

-- DropForeignKey
ALTER TABLE "UserCommand" DROP CONSTRAINT "UserCommand_userId_fkey";

-- DropIndex
DROP INDEX "Command_name_key";

-- AlterTable
ALTER TABLE "Command" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "title",
ADD COLUMN     "actionId" INTEGER NOT NULL,
ADD COLUMN     "cooldown" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "text" VARCHAR(255) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "commandId",
ADD COLUMN     "actionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserCommand";

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL DEFAULT '',

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Action_name_key" ON "Action"("name");

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
