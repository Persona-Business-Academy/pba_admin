import { Topic } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { InstructorType } from "../models/instructors";
import { JobModel } from "../models/job";
import { OfflineCourse } from "../models/offlineCourses";
import { OnlineCourse } from "../models/onlineCourses";
import { CreateEditInstructorValidation } from "../validation/instructors";
import { CreateEditJobValidation } from "../validation/jobs";
import { CreateOfflineCourseValidation } from "../validation/offline-courses";
import { CreateEditOnlineCourseValidation } from "../validation/online-courses";

export const generateOfflineCourseDefaultValues = (
  offlineCourse: OfflineCourse,
  forKids: boolean,
): CreateOfflineCourseValidation => ({
  title: offlineCourse?.title || "",
  topic: offlineCourse?.topic || Topic.DEVELOPMENT,
  subTitle: offlineCourse?.subTitle || "",
  description: offlineCourse?.description || "",
  language: offlineCourse?.language || "ARM",
  ageLimit: offlineCourse?.ageLimit || "",
  totalDuration: offlineCourse?.totalDuration || 0,
  courseLevel: offlineCourse?.courseLevel || "BEGINNER",
  graduatedStudentsCount: offlineCourse?.graduatedStudentsCount || 0,
  enrolledStudentsCount: offlineCourse?.enrolledStudentsCount || 0,
  price: offlineCourse?.price || 0,
  currency: offlineCourse?.currency || "AMD",
  lessonsCount: offlineCourse?.lessonsCount || 0,
  coverPhoto: offlineCourse?.coverPhoto || "",
  mediaId: offlineCourse?.mediaId || uuidv4(),
  whatYouWillLearn:
    offlineCourse?.whatYouWillLearn.map(item => ({ id: uuidv4(), value: item })) || [],
  forKids: offlineCourse?.forKids || forKids,
  disabled: !!offlineCourse?.disabled,
});

export const generateOnlineCourseDefaultValues = (
  onlineCourse: OnlineCourse,
): CreateEditOnlineCourseValidation => ({
  title: onlineCourse?.title || "",
  description: onlineCourse?.description || "",
  courseLevel: onlineCourse?.courseLevel || "BEGINNER",
  topic: onlineCourse?.topic || Topic.DEVELOPMENT,
  language: onlineCourse?.language || "ARM",
  instructorId: onlineCourse?.instructorId || undefined!,
  coverPhoto: onlineCourse?.coverPhoto || "",
  mediaId: onlineCourse?.mediaId || uuidv4(),
  whatYouWillLearn:
    onlineCourse?.whatYouWillLearn.map(item => ({ id: uuidv4(), value: item })) || [],
});

export const generateInstructorDefaultValues = (
  instructor: InstructorType,
): CreateEditInstructorValidation => ({
  firstName: instructor?.firstName || "",
  lastName: instructor?.lastName || "",
  about: instructor?.about || "",
  graduatedStudentsCount: instructor?.graduatedStudentsCount || 0,
  enrolledStudentsCount: instructor?.enrolledStudentsCount || 0,
  avatar: instructor?.avatar || "",
  profession: instructor?.profession || "",
  mediaId: instructor?.mediaId || uuidv4(),
});

export const generateJobDefaultValues = (job: JobModel): CreateEditJobValidation => ({
  title: job?.title || "",
  description: job?.description || "",
  salary: job?.salary || "",
  workingHours: job?.workingHours || "",
  contractType: job?.contractType || "",
  responsibilities: job?.responsibilities || "",
  requirements: job?.requirements || "",
  disabled: !!job?.disabled,
});
