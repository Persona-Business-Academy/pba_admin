import { FC, memo, useCallback, useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { OnlineCourse } from "@/models/onlineCourses";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onlineCourse: OnlineCourse;
};

const DeleteOnlineCourseModal: FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  onlineCourse,
}) => {
  const cancelRef = useRef(null);

  const { mutate, isLoading } = useMutation<number, { message: string }>(
    () => OnlineCourseService.deleteOnlineCourse(onlineCourse.id),
    {
      onSuccess: async () => {
        onSave();
        onClose();
      },
    }
  );

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete <b>{onlineCourse.name}</b> Online Course
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete this course ?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={useCallback(() => mutate(), [mutate])}
              ml={3}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default memo(DeleteOnlineCourseModal);
