/*
  Warnings:

  - You are about to drop the column `name` on the `Users` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Users" DROP COLUMN "name",
ADD COLUMN     "firstName" VARCHAR(40) NOT NULL;
