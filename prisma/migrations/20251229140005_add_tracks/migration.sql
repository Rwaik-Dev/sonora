/*
  Warnings:

  - Added the required column `contentType` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "contentType" TEXT NOT NULL;
