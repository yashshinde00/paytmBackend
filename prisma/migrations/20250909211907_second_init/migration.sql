/*
  Warnings:

  - Added the required column `lastName` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "lastName" TEXT NOT NULL;
