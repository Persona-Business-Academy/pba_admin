import React, { Dispatch, FC, memo, SetStateAction, useCallback, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { Maybe } from "@/utils/models/common";
import { LocalVideo } from "@/utils/models/offlineCourses";
import { UploadFile, Video } from "../atom";

type Props = {
  videoKey: string;
  progress: number;
  uploading: boolean;
  localVideo: Maybe<LocalVideo>;
  setLocalVideo: Dispatch<SetStateAction<Maybe<LocalVideo>>>;
};

const OfflineCourseVideo: FC<Props> = ({
  videoKey,
  progress,
  uploading,
  localVideo,
  setLocalVideo,
}) => {
  const submitHandler = useCallback(
    (files?: Maybe<FileList>) => {
      if (!files?.length) return;
      setLocalVideo({
        name: files[0].name,
        key: URL.createObjectURL(files[0]),
        file: files[0],
      });
    },
    [setLocalVideo],
  );

  const videoProps = useMemo(() => {
    if (localVideo) {
      return { name: localVideo.name, videoKey: "", localKey: localVideo.key };
    }
    if (videoKey) {
      return { name: "About Course", videoKey };
    }
    return null;
  }, [localVideo, videoKey]);

  return (
    <Box mb={5}>
      <UploadFile content="Video" changeHandler={submitHandler} accept="video/*" />
      {!!videoProps ? (
        <Video {...videoProps} uploadProgress={progress} uploading={uploading} />
      ) : (
        "No video yet"
      )}
    </Box>
  );
};

export default memo(OfflineCourseVideo);
