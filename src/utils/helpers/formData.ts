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
  title: !!offlineCourse ? offlineCourse.title : "",
  topic: !!offlineCourse ? offlineCourse.topic : Topic.DEVELOPMENT,
  subTitle: !!offlineCourse ? offlineCourse.subTitle : "",
  description: !!offlineCourse ? offlineCourse.description : "",
  language: !!offlineCourse ? offlineCourse.language : "ARM",
  ageLimit: !!offlineCourse ? offlineCourse.ageLimit : "",
  totalDuration: !!offlineCourse ? offlineCourse.totalDuration : 0,
  courseLevel: !!offlineCourse ? offlineCourse.courseLevel : "BEGINNER",
  graduatedStudentsCount: !!offlineCourse ? offlineCourse.graduatedStudentsCount : 0,
  enrolledStudentsCount: !!offlineCourse ? offlineCourse.enrolledStudentsCount : 0,
  price: !!offlineCourse ? offlineCourse.price : 0,
  currency: !!offlineCourse ? offlineCourse.currency : "AMD",
  lessonsCount: !!offlineCourse ? offlineCourse.lessonsCount : 0,
  coverPhoto: !!offlineCourse ? offlineCourse.coverPhoto : "",
  mediaId: !!offlineCourse ? offlineCourse.mediaId : uuidv4(),
  whatYouWillLearn: !!offlineCourse
    ? offlineCourse.whatYouWillLearn.map(item => ({ id: uuidv4(), value: item }))
    : [],
  forKids: offlineCourse?.forKids || forKids,
  rating: offlineCourse?.rating || 0,
});

export const generateOnlineCourseDefaultValues = (
  onlineCourse: OnlineCourse,
): CreateEditOnlineCourseValidation => ({
  title: !!onlineCourse ? onlineCourse.title : "",
  description: !!onlineCourse ? onlineCourse.description : "",
  courseLevel: !!onlineCourse ? onlineCourse.courseLevel : "BEGINNER",
  topic: !!onlineCourse ? onlineCourse.topic : Topic.DEVELOPMENT,
  language: !!onlineCourse ? onlineCourse.language : "ARM",
  instructorId: !!onlineCourse ? onlineCourse.instructorId : undefined!,
  coverPhoto: !!onlineCourse ? onlineCourse.coverPhoto : "",
  mediaId: !!onlineCourse ? onlineCourse.mediaId : uuidv4(),
  whatYouWillLearn: !!onlineCourse
    ? onlineCourse.whatYouWillLearn.map(item => ({ id: uuidv4(), value: item }))
    : [],
});

export const generateInstructorDefaultValues = (
  instructor: InstructorType,
): CreateEditInstructorValidation => ({
  firstName: !!instructor ? instructor.firstName : "",
  lastName: !!instructor ? instructor.lastName : "",
  about: !!instructor ? instructor.about : "",
  avatar: !!instructor ? instructor.avatar : "",
  profession: !!instructor ? instructor.profession : "",
  mediaId: !!instructor ? instructor.mediaId : uuidv4(),
});

export const generateJobDefaultValues = (job: JobModel): CreateEditJobValidation => ({
  title: job?.title || "",
  description: job?.description || "",
  salary: job?.salary || "",
  workingHours: job?.workingHours || "",
  contractType: job?.contractType || "",
  responsibilities: job?.responsibilities || "",
  requirements: job?.requirements || "",
  disabled: job?.disabled || false,
});
