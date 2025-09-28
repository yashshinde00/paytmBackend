/*
  Warnings:

  - You are about to alter the column `name` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - You are about to alter the column `email` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `password` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - You are about to alter the column `lastName` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.

*/
-- AlterTable
ALTER TABLE "public"."Users" ALTER COLUMN "name" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(40);
