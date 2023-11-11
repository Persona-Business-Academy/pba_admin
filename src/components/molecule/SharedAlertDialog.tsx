import { FC, memo, useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  title: string | React.ReactNode;
  onClose: () => void;
  deleteFn: () => void;
};

const SharedAlertDialog: FC<Props> = ({ isOpen, isLoading, title, onClose, deleteFn }) => {
  const cancelRef = useRef(null);
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>Are you sure you want to delete this ?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={deleteFn} ml={3} isLoading={isLoading}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default memo(SharedAlertDialog);
