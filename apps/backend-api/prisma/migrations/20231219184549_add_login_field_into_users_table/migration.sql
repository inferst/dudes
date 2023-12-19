/*
  Warnings:

  - Added the required column `twitchLogin` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twitchLogin" VARCHAR(255) NOT NULL;
