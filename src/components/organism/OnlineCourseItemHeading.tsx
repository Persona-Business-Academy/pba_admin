import React, { FC, memo, useCallback, useState } from "react";
import { Box, Heading, HStack, IconButton } from "@chakra-ui/react";
import { BsPlusCircleFill } from "react-icons/bs";
import { Maybe } from "@/models/common";
import { OnlineCourseType } from "@/models/onlineCourses";
import { CreateOnlineCourseDayModal, CreateOnlineCourseLevelModal } from "../molecule";

type Props = {
  title: string;
  type: OnlineCourseType;
  onlineCourseId: number;
  levelId?: number;
  dayId?: number;
  children: React.ReactNode;
};

const OnlineCourseItemHeading: FC<Props> = ({ title, type, onlineCourseId, levelId, children }) => {
  const [openedModalType, setOpenedModalType] = useState<Maybe<OnlineCourseType>>(null);

  const onBtnClick = useCallback(() => {
    switch (type) {
      case "levels":
      case "days":
        return setOpenedModalType(type);
      default:
        return;
    }
  }, [type]);

  const onClose = useCallback(() => setOpenedModalType(null), []);

  return (
    <Box>
      <HStack spacing={5} paddingY={5}>
        <Heading as="h4" size="lg" color="blue.500">
          {title}
        </Heading>
        <IconButton
          isRound
          aria-label="add"
          icon={<BsPlusCircleFill />}
          colorScheme="blue"
          fontSize="20px"
          onClick={onBtnClick}
        />
      </HStack>
      {children}
      {openedModalType === "levels" && onlineCourseId && (
        <CreateOnlineCourseLevelModal onlineCourseId={onlineCourseId} onClose={onClose} />
      )}
      {openedModalType === "days" && onlineCourseId && levelId && (
        <CreateOnlineCourseDayModal
          onlineCourseId={onlineCourseId}
          levelId={levelId}
          onClose={onClose}
        />
      )}
    </Box>
  );
};

export default memo(OnlineCourseItemHeading);
