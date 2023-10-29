"use client";
import { FC, memo } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actionButtonText: string;
  actionButtonDisabled?: boolean;
  action: () => void;
  isLoading: boolean;
};

const SharedModal: FC<Props> = ({
  isOpen,
  onClose,
  title,
  children,
  actionButtonText,
  actionButtonDisabled,
  action,
  isLoading,
}) => (
  <Modal
    isCentered
    isOpen={isOpen}
    onClose={onClose}
    closeOnOverlayClick={!isLoading}
    closeOnEsc={false}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button mr={3} onClick={onClose} isDisabled={isLoading}>
          Close
        </Button>
        <Button
          colorScheme="blue"
          onClick={action}
          isLoading={isLoading}
          isDisabled={actionButtonDisabled}>
          {actionButtonText}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default memo(SharedModal);