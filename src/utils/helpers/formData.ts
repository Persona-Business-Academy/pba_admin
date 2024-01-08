import { Topic } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { InstructorType } from "../models/instructors";
import { OfflineCourse } from "../models/offlineCourses";
import { OnlineCourse } from "../models/onlineCourses";

export const generateOfflineCourseDefaultValues = (offlineCourse: OfflineCourse) => ({
  title: !!offlineCourse ? offlineCourse.title : "",
  topic: !!offlineCourse ? offlineCourse.topic : Topic.FRONT_END,
  subTitle: !!offlineCourse ? offlineCourse.subTitle : "",
  description: !!offlineCourse ? offlineCourse.description : "",
  language: !!offlineCourse ? offlineCourse.language : "ARM",
  ageLimit: !!offlineCourse ? offlineCourse.ageLimit : "",
  totalDuration: !!offlineCourse ? offlineCourse.totalDuration : 0,
  level: !!offlineCourse ? offlineCourse.courseLevel : "BEGINNER",
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
});

export const generateOnlineCourseDefaultValues = (onlineCourse: OnlineCourse) => ({
  title: !!onlineCourse ? onlineCourse.title : "",
  description: !!onlineCourse ? onlineCourse.description : "",
  courseLevel: !!onlineCourse ? onlineCourse.courseLevel : "BEGINNER",
  topic: !!onlineCourse ? onlineCourse.topic : "FRONT_END",
  language: !!onlineCourse ? onlineCourse.language : "ARM",
  instructorId: !!onlineCourse ? onlineCourse.instructorId : undefined,
  coverPhoto: !!onlineCourse ? onlineCourse.coverPhoto : "",
  coverPhotoId: !!onlineCourse ? onlineCourse.mediaId : uuidv4(),
  whatYouWillLearn: !!onlineCourse
    ? onlineCourse.whatYouWillLearn.map(item => ({ id: uuidv4(), value: item }))
    : [],
});

export const generateInstructorDefaultValues = (instructor: InstructorType) => ({
  firstName: !!instructor ? instructor.firstName : "",
  lastName: !!instructor ? instructor.lastName : "",
  about: !!instructor ? instructor.about : "",
  avatar: !!instructor ? instructor.avatar : "",
  avatarId: !!instructor ? instructor.mediaId : uuidv4(),
});