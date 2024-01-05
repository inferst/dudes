/*
  Warnings:

  - You are about to drop the column `cooldown` on the `Command` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Command` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Command` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Command` table. All the data in the column will be lost.
  - Added the required column `name` to the `Command` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Command" DROP CONSTRAINT "Command_userId_fkey";

-- AlterTable
ALTER TABLE "Command" DROP COLUMN "cooldown",
DROP COLUMN "isActive",
DROP COLUMN "text",
DROP COLUMN "userId",
ADD COLUMN     "name" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "UserCommand" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "text" VARCHAR(255) NOT NULL,
    "cooldown" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserCommand_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCommand" ADD CONSTRAINT "UserCommand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
