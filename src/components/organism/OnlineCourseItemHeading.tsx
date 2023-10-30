import React, { FC, memo, useCallback, useState } from "react";
import { Box, Heading, HStack, IconButton } from "@chakra-ui/react";
import { BsPlusCircleFill } from "react-icons/bs";
import { generateOnlineCourseFileName, uploadDocumentToAWS } from "@/helpers/uploadFile";
import { Maybe, UploadProgressType } from "@/models/common";
import { OnlineCourseType } from "@/models/onlineCourses";
import { UploadFile } from "../atom";
import { CreateOnlineCourseDayModal, CreateOnlineCourseLevelModal } from "../molecule";

type Props = {
  title: string;
  type: OnlineCourseType;
  onlineCourseId: number;
  levelId?: number;
  dayId?: number;
  children: React.ReactNode;
  videosLength?: number;
};

const OnlineCourseItemHeading: FC<Props> = ({
  title,
  type,
  onlineCourseId,
  levelId,
  dayId,
  children,
  videosLength,
}) => {
  const [openedModalType, setOpenedModalType] = useState<Maybe<OnlineCourseType>>(null);
  const [_, setUploadProgress] = useState<Record<string, UploadProgressType>>({});

  const handleUploadProgress = useCallback(
    ({ fileName, progress }: UploadProgressType) =>
      setUploadProgress({ [fileName]: { fileName, progress } }),
    [],
  );

  const submitHandler = useCallback(
    async (files?: Maybe<FileList>) => {
      if (!files?.length) return;
      if (typeof videosLength !== "number" || !levelId || !dayId) return;

      const fileData = await uploadDocumentToAWS({
        file: files[0],
        fileName: generateOnlineCourseFileName(onlineCourseId, levelId, dayId, videosLength),
        handleUploadProgress,
      });
      return fileData;
    },
    [dayId, handleUploadProgress, levelId, onlineCourseId, videosLength],
  );

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
        {type === "videos" ? (
          <UploadFile changeHandler={submitHandler} />
        ) : (
          <IconButton
            isRound
            aria-label="add"
            icon={<BsPlusCircleFill />}
            colorScheme="blue"
            fontSize="20px"
            onClick={onBtnClick}
          />
        )}
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
