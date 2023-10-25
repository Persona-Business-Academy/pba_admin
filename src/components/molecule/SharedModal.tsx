"use client";
import { FC, memo } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Button } from "../atom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actionButtonText: string;
  actionButtonColorScheme?: string;
  action: () => void;
  isLoading: boolean;
};

const SharedModal: FC<Props> = ({
  isOpen,
  onClose,
  title,
  children,
  actionButtonText,
  actionButtonColorScheme = "primary",
  action,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isLoading} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            colorScheme="blue"
            mr={3}
            onClick={onClose}
            isDisabled={isLoading}>
            Close
          </Button>
          <Button colorScheme={actionButtonColorScheme} onClick={action} isLoading={isLoading}>
            {actionButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(SharedModal);
