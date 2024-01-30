/*
  Warnings:

  - You are about to drop the column `accessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tokenRevoked` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twitchId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twitchLogin` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UserToken" (
    "id" SERIAL NOT NULL,
    "accessToken" VARCHAR(255) NOT NULL,
    "refreshToken" VARCHAR(255) NOT NULL,
    "platformUserId" VARCHAR(255) NOT NULL,
    "platformLogin" VARCHAR(255) NOT NULL,
    "expiresIn" INTEGER NOT NULL DEFAULT 0,
    "obtainmentTimestamp" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "platformId" INTEGER NOT NULL,
    "isTokenRevoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_userId_platformId_key" ON "UserToken"("userId", "platformId");

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_platformUserId_platformId_key" ON "UserToken"("platformUserId", "platformId");

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- MigrateData
INSERT INTO "UserToken" ("userId", "platformUserId", "platformLogin", "accessToken", "refreshToken", "platformId")
SELECT "id", "twitchId", "twitchLogin", "accessToken", "refreshToken", '1' FROM "User";

-- DropIndex
DROP INDEX "User_twitchId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessToken",
DROP COLUMN "refreshToken",
DROP COLUMN "tokenRevoked",
DROP COLUMN "twitchId",
DROP COLUMN "twitchLogin";
