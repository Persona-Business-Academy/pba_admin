import React, { FC, memo, useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Box } from "@chakra-ui/react";
import { OnlineCourseVideo } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { refetchOnlineCourseById } from "@/helpers/queryClient";
import { generateOnlineCourseFileName, uploadDocumentToAWS } from "@/helpers/uploadFile";
import { Maybe } from "@/models/common";
import { CreateOnlineCourseVideoValidation } from "@/validation/online-courses";
import { UploadFile, Video } from "../atom";

type Props = {
  videos: OnlineCourseVideo[];
  onlineCourseId: number;
  levelId: number;
  dayId: number;
};

const OnlineCourseVideos: FC<Props> = ({ videos, onlineCourseId, levelId, dayId }) => {
  const memoizedData = useMemo(
    () => videos.map(item => ({ ...item, uploading: false, progress: 0 })),
    [videos],
  );

  const [localVideos, setLocalVideos] = useState(memoizedData);
  const queryClient = useQueryClient();

  const onSuccess = useCallback(
    async (_: number, variables: CreateOnlineCourseVideoValidation) => {
      setLocalVideos(prevData => prevData.filter(({ key }) => key !== variables.key));
      await refetchOnlineCourseById(queryClient, onlineCourseId);
    },
    [onlineCourseId, queryClient],
  );

  const { mutate } = useMutation<number, { message: string }, CreateOnlineCourseVideoValidation>(
    OnlineCourseService.createOnlineCourseVideo,
    { onSuccess },
  );

  const submitHandler = useCallback(
    async (files?: Maybe<FileList>) => {
      if (!files?.length || !levelId || !dayId) return;
      const localFileName = files[0].name;
      const nameForAWS = generateOnlineCourseFileName(onlineCourseId, levelId, dayId);

      setLocalVideos(prevData => [
        ...prevData,
        {
          id: Date.now(),
          name: `Uploading ${localFileName}`,
          key: nameForAWS,
          onlineCourseId,
          onlineCourseLevelId: levelId,
          onlineCourseDayId: dayId,
          createdAt: new Date(),
          updatedAt: new Date(),
          uploading: true,
          progress: 0,
        },
      ]);

      const res = await uploadDocumentToAWS({
        file: files[0],
        fileName: nameForAWS,
        handleUploadProgress: ({ progress, key }) =>
          setLocalVideos(prevData =>
            prevData.map(item => {
              if (item.key === key) {
                return { ...item, progress };
              }
              return item;
            }),
          ),
      });

      mutate({
        key: res.key,
        name: localFileName,
        onlineCourseId,
        onlineCourseDayId: dayId,
        onlineCourseLevelId: levelId,
      });
    },
    [dayId, levelId, mutate, onlineCourseId],
  );

  const renderVideos = useCallback(
    ({ id, key, name, uploading, progress }: (typeof localVideos)[0]) => (
      <Video key={id} name={name} videoKey={key} uploadProgress={progress} uploading={uploading} />
    ),
    [],
  );

  useLayoutEffect(() => {
    setLocalVideos(memoizedData);
  }, [memoizedData]);

  return (
    <Box>
      <UploadFile content="Videos" changeHandler={submitHandler} accept="video/*" />
      {localVideos.map(renderVideos)}
    </Box>
  );
};

export default memo(OnlineCourseVideos);
