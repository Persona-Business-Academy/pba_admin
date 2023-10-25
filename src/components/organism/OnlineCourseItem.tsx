import React, { FC, memo, useCallback, useState } from "react";
import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { BsPlusCircleFill } from "react-icons/bs";
import {
  AddEditOnilneCourseDayModal,
  AddEditOnilneCourseLevelModal,
  AddEditOnilneCourseVideoModal,
} from "@/components/molecule";
import { Maybe } from "@/models/common";
import { OnlineCourseType } from "@/models/onlineCourses";

type ModalByTypeProps = {
  type: Maybe<OnlineCourseType>;
  onClose: () => void;
};

const ModalByType: FC<ModalByTypeProps> = memo(({ type, onClose }) => {
  switch (type) {
    case "levels":
      return <AddEditOnilneCourseLevelModal onClose={onClose} />;
    case "days":
      return <AddEditOnilneCourseDayModal onClose={onClose} />;
    case "videos":
      return <AddEditOnilneCourseVideoModal onClose={onClose} />;
    default:
      return null;
  }
});
ModalByType.displayName = "ModalByType";

type Props = {
  title: string;
  type: OnlineCourseType;
  children: React.ReactNode;
};

const OnlineCourseItem: FC<Props> = ({ title, type, children }) => {
  const [openedModal, setOpenedModal] = useState<Maybe<OnlineCourseType>>(null);

  const onOpenModal = useCallback(() => setOpenedModal(type), [type]);
  const onCloseModal = useCallback(() => setOpenedModal(null), []);

  return (
    <>
      <Box>
        <Flex w="200px" justifyContent="space-between" alignItems="center" paddingY={5}>
          <Heading as="h4" size="lg">
            {title}
          </Heading>
          <IconButton
            isRound
            aria-label="add"
            icon={<BsPlusCircleFill />}
            colorScheme="blue"
            fontSize="20px"
            onClick={onOpenModal}
          />
        </Flex>
        {children}
      </Box>
      <ModalByType type={openedModal} onClose={onCloseModal} />
    </>
  );
};

export default memo(OnlineCourseItem);
