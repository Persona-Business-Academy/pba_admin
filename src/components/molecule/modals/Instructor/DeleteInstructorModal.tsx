import { FC, memo, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { InstructorService } from "@/api/services/InstructorsService";
import { InstructorType } from "@/models/instructors";
import SharedAlertDialog from "../../SharedAlertDialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  instructor: NonNullable<InstructorType>;
};

const DeleteInstructorModal: FC<Props> = ({ isOpen, onClose, onSave, instructor }) => {
  const { mutate, isLoading } = useMutation<number, { message: string }>(
    () => InstructorService.deleteInstructor(instructor.id),
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
        Delete{" "}
        <b>
          {instructor.firstName} {instructor.lastName}
        </b>{" "}
        Online Course
      </>
    ),
    [instructor.firstName, instructor.lastName],
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

export default memo(DeleteInstructorModal);
