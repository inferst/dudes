/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Command` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Command` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "title" VARCHAR(255) NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Command_name_key" ON "Command"("name");
