/*
  Warnings:

  - Added the required column `name` to the `OnlineCourseVideo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OnlineCourseVideo" ADD COLUMN     "name" VARCHAR(45) NOT NULL,
ALTER COLUMN "key" SET DATA TYPE VARCHAR(60);
