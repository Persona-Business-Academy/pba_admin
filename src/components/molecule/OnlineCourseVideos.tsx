import React, { FC, memo, useCallback, useState } from "react";
import { Box } from "@chakra-ui/react";
import { OnlineCourseVideo } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { refetchOnlineCourseById } from "@/helpers/queryClient";
import { generateOnlineCourseFileName, uploadDocumentToAWS } from "@/helpers/uploadFile";
import { Maybe, UploadProgressType } from "@/models/common";
import { CreateOnlineCourseVideoValidation } from "@/validation/online-courses";
import { UploadFile, Video } from "../atom";

type Props = {
  videos: OnlineCourseVideo[];
  onlineCourseId: number;
  levelId: number;
  dayId: number;
};

const OnlineCourseVideos: FC<Props> = ({ videos, onlineCourseId, levelId, dayId }) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressType>>({});
  const [localVideos, setLocalVideos] = useState(
    videos.map(item => ({ ...item, uploading: false })),
  );
  const queryClient = useQueryClient();

  const onSuccess = useCallback(
    async () => await refetchOnlineCourseById(queryClient, onlineCourseId),
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
        },
      ]);

      const res = await uploadDocumentToAWS({
        file: files[0],
        fileName: nameForAWS,
        handleUploadProgress: ({ fileName, progress, key }) =>
          setUploadProgress(prevData => ({
            ...(prevData || {}),
            [key]: { fileName, progress, key },
          })),
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

  return (
    <Box>
      <UploadFile title="Videos" changeHandler={submitHandler} />
      {localVideos.map(({ id, key, name, uploading }) => {
        return (
          <Video
            key={id}
            name={name}
            videoKey={key}
            uploadProgress={uploadProgress[key]?.progress}
            uploading={uploading}
          />
        );
      })}
    </Box>
  );
};

export default memo(OnlineCourseVideos);
