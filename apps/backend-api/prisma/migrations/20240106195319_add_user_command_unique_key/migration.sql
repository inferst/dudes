/*
  Warnings:

  - A unique constraint covering the columns `[userId,commandId]` on the table `UserCommand` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserCommand_userId_commandId_key" ON "UserCommand"("userId", "commandId");
