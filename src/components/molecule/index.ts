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
const ChangeInstructorsModal = dynamic(
  () => import("./modals/OfflineCourse/ChangeInstructorsModal"),
);
const EditCommentsModal = dynamic(() => import("./modals/Comments/EditCommentsModal"));
const VideosModal = dynamic(() => import("./modals/OfflineCourse/VideosModal"));
const TimelineModal = dynamic(() => import("./modals/OfflineCourse/TimelineModal"));

export {
  SearchTable,
  OnlineCourseVideos,
  TimelineModal,
  VideosModal,
  EditCommentsModal,
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
  ChangeInstructorsModal,
};
