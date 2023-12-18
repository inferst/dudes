/*
  Warnings:

  - A unique constraint covering the columns `[twitchId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_twitchId_key" ON "User"("twitchId");
