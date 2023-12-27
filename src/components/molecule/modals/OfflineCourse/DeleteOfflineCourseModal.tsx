import { FC, memo, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { OfflineCourse } from "@/utils/models/offlineCourses";

const SharedAlertDialog = dynamic(() => import("../../SharedAlertDialog"));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  offlineCourse: NonNullable<OfflineCourse>;
};

const DeleteOfflineCourseModal: FC<Props> = ({ isOpen, onClose, onSave, offlineCourse }) => {
  const { mutate, isLoading } = useMutation<number, { message: string }>(
    () => OfflineCourseService.deleteOfflineCourse(offlineCourse.id),
    {
      onSuccess: async () => {
        onSave();
        onClose();
      },
    },
  );

  const Title = useMemo(
    () => (
      <>
        Delete <b>{offlineCourse.title}</b> Offline Course
      </>
    ),
    [offlineCourse.title],
  );

  return (
    <SharedAlertDialog
      isOpen={isOpen}
      title={Title}
      isLoading={isLoading}
      deleteFn={mutate}
      onClose={onClose}
    />
  );
};

export default memo(DeleteOfflineCourseModal);
