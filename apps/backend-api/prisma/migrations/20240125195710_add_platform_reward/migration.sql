/*
  Warnings:

  - You are about to drop the column `cooldown` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the column `isPaused` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Reward` table. All the data in the column will be lost.
  - Added the required column `platformId` to the `Reward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformRewardId` to the `Reward` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "cooldown",
DROP COLUMN "cost",
DROP COLUMN "description",
DROP COLUMN "isActive",
DROP COLUMN "isPaused",
DROP COLUMN "title",
ADD COLUMN     "platformId" INTEGER NOT NULL,
ADD COLUMN     "platformRewardId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
