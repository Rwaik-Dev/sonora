/*
  Warnings:

  - Added the required column `accessKeyId` to the `Bucket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secretAccessKey` to the `Bucket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bucket" ADD COLUMN     "accessKeyId" TEXT NOT NULL,
ADD COLUMN     "secretAccessKey" TEXT NOT NULL;
