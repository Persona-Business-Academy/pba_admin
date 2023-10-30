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
import { generateAWSUrl } from "@/helpers/common";

type Props = { title: string; videoKey: string; onClose: () => void };

const VideoPreview: FC<Props> = ({ title, videoKey, onClose }) => (
  <Modal isOpen onClose={onClose} size="3xl">
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
