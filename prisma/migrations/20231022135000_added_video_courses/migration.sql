/*
  Warnings:

  - You are about to drop the column `created_at` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(0) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(0) NOT NULL;

-- CreateTable
CREATE TABLE "OnlineCourse" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "OnlineCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineCourseLevel" (
    "id" SERIAL NOT NULL,
    "level" VARCHAR(45) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "onlineCourseId" INTEGER NOT NULL,

    CONSTRAINT "OnlineCourseLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineCourseDay" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(45) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "onlineCourseId" INTEGER NOT NULL,
    "onlineCourseLevelId" INTEGER NOT NULL,

    CONSTRAINT "OnlineCourseDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineCourseVideo" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(45) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "onlineCourseId" INTEGER NOT NULL,
    "onlineCourseLevelId" INTEGER NOT NULL,
    "onlineCourseDayId" INTEGER NOT NULL,

    CONSTRAINT "OnlineCourseVideo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OnlineCourseLevel" ADD CONSTRAINT "OnlineCourseLevel_onlineCourseId_fkey" FOREIGN KEY ("onlineCourseId") REFERENCES "OnlineCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineCourseDay" ADD CONSTRAINT "OnlineCourseDay_onlineCourseId_fkey" FOREIGN KEY ("onlineCourseId") REFERENCES "OnlineCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineCourseDay" ADD CONSTRAINT "OnlineCourseDay_onlineCourseLevelId_fkey" FOREIGN KEY ("onlineCourseLevelId") REFERENCES "OnlineCourseLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineCourseVideo" ADD CONSTRAINT "OnlineCourseVideo_onlineCourseId_fkey" FOREIGN KEY ("onlineCourseId") REFERENCES "OnlineCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineCourseVideo" ADD CONSTRAINT "OnlineCourseVideo_onlineCourseLevelId_fkey" FOREIGN KEY ("onlineCourseLevelId") REFERENCES "OnlineCourseLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineCourseVideo" ADD CONSTRAINT "OnlineCourseVideo_onlineCourseDayId_fkey" FOREIGN KEY ("onlineCourseDayId") REFERENCES "OnlineCourseDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
