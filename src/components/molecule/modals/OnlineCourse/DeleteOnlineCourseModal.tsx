import { FC, memo, useMemo } from "react";
import { OnlineCourse } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import SharedAlertDialog from "../../SharedAlertDialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onlineCourse: OnlineCourse;
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
