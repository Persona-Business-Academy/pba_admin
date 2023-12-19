"use client";
import dynamic from "next/dynamic";
import OnlineCourseVideos from "./OnlineCourseVideos";
import SearchTable from "./SearchTable";

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

const SharedModal = dynamic(() => import("./SharedModal"));
const SharedAlertDialog = dynamic(() => import("./SharedAlertDialog"));

const CreateEditInstructorModal = dynamic(
  () => import("./modals/Instructor/CreateEditInstructorModal"),
);
const DeleteInstructorModal = dynamic(() => import("./modals/Instructor/DeleteInstructorModal"));

const CreateEditOfflineCourseModal = dynamic(
  () => import("./modals/OfflineCourse/CreateEditOfflineCourse"),
);

const DeleteOfflineCourseModal = dynamic(
  () => import("./modals/OfflineCourse/DeleteOfflineCourseModal"),
);

export {
  SearchTable,
  OnlineCourseVideos,
  CreateEditOnlineCourseModal,
  DeleteOnlineCourseModal,
  SharedModal,
  CreateOnlineCourseDayModal,
  CreateOnlineCourseLevelModal,
  SharedAlertDialog,
  CreateEditInstructorModal,
  DeleteInstructorModal,
  CreateEditOfflineCourseModal,
  DeleteOfflineCourseModal,
};
