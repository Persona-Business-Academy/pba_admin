"use client";
import dynamic from "next/dynamic";

const CreateEditOnlineCourseModal = dynamic(
  () => import("./modals/OnlineCourse/CreateEditOnlineCourseModal"),
);
const CreateOnlineCourseDayModal = dynamic(
  () => import("./modals/OnlineCourse/CreateOnlineCourseDayModal"),
);
const CreateOnlineCourseLevelModal = dynamic(
  () => import("./modals/OnlineCourse/CreateOnlineCourseLevelModal"),
);
const DeleteOnlineCourseModal = dynamic(
  () => import("./modals/OnlineCourse/DeleteOnlineCourseModal"),
);
const OnlineCourseVideos = dynamic(() => import("./OnlineCourseVideos"));
const SearchTable = dynamic(() => import("./SearchTable"));
const SharedModal = dynamic(() => import("./SharedModal"));
const SharedAlertDialog = dynamic(() => import("./SharedAlertDialog"));

export {
  SearchTable,
  CreateEditOnlineCourseModal,
  DeleteOnlineCourseModal,
  SharedModal,
  CreateOnlineCourseDayModal,
  CreateOnlineCourseLevelModal,
  OnlineCourseVideos,
  SharedAlertDialog,
};
