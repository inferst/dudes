/*
  Warnings:

  - Added the required column `commandId` to the `UserCommand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCommand" ADD COLUMN     "commandId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserCommand" ADD CONSTRAINT "UserCommand_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
