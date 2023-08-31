/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "firstName" VARCHAR(45),
ADD COLUMN     "lastName" VARCHAR(45),
ADD COLUMN     "password" VARCHAR(60) NOT NULL;
