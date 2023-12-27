import { FC, memo } from "react";
import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import ReactPlayer from "react-player/lazy";
import { generateAWSUrl } from "@/utils/helpers/common";

type Props = { isOpen: boolean; title: string; videoKey: string; onClose: () => void };

const VideoPreview: FC<Props> = ({ isOpen, title, videoKey, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="3xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Center>
          <ReactPlayer playing controls url={generateAWSUrl(videoKey)} />
        </Center>
      </ModalBody>
    </ModalContent>
  </Modal>
);
export default memo(VideoPreview);
