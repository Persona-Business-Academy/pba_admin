import { FC, memo, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { OnlineCourse } from "@/models/onlineCourses";

const SharedAlertDialog = dynamic(() => import("../../SharedAlertDialog"));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onlineCourse: NonNullable<OnlineCourse>;
};

const DeleteOnlineCourseModal: FC<Props> = ({ isOpen, onClose, onSave, onlineCourse }) => {
  const { mutate, isLoading } = useMutation<number, { message: string }>(
    () => OnlineCourseService.deleteOnlineCourse(onlineCourse.id),
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
        Delete <b>{onlineCourse.name}</b> Online Course
      </>
    ),
    [onlineCourse.name],
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

export default memo(DeleteOnlineCourseModal);
