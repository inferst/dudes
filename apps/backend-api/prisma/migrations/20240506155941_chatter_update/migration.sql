/*
  Warnings:

  - You are about to drop the column `chatterName` on the `Chatter` table. All the data in the column will be lost.
  - Added the required column `chatterId` to the `Chatter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformId` to the `Chatter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chatter" DROP COLUMN "chatterName",
ADD COLUMN     "chatterId" VARCHAR(255) NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "platformId" INTEGER NOT NULL,
ALTER COLUMN "sprite" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "Chatter" ADD CONSTRAINT "Chatter_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
