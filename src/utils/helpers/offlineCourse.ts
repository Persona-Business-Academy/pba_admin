import { Topic } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { OfflineCourse } from "../models/offlineCourses";

export const generateOfflineCourseDefaultValues = (offlineCourse: OfflineCourse) => ({
  title: !!offlineCourse ? offlineCourse.title : "",
  topic: !!offlineCourse ? offlineCourse.topic : Topic.FRONT_END,
  subTitle: !!offlineCourse ? offlineCourse.subTitle : "",
  description: !!offlineCourse ? offlineCourse.description : "",
  language: !!offlineCourse ? offlineCourse.language : "ARM",
  ageLimit: !!offlineCourse ? offlineCourse.ageLimit : "",
  totalDuration: !!offlineCourse ? offlineCourse.totalDuration : 0,
  level: !!offlineCourse ? offlineCourse.level : "BEGINNER",
  graduatedStudentsCount: !!offlineCourse ? offlineCourse.graduatedStudentsCount : 0,
  enrolledStudentsCount: !!offlineCourse ? offlineCourse.enrolledStudentsCount : 0,
  price: !!offlineCourse ? offlineCourse.price : 0,
  currency: !!offlineCourse ? offlineCourse.currency : "AMD",
  lessonsCount: !!offlineCourse ? offlineCourse.lessonsCount : 0,
  coverPhoto: !!offlineCourse ? offlineCourse.coverPhoto : "",
  coverPhotoId: !!offlineCourse ? offlineCourse.coverPhotoId : uuidv4(),
});
