import React, { FC, memo, useMemo } from "react";
import { Button, HStack, Progress, Text, useBoolean } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import ItemWrapper from "./ItemWrapper";

const VideoPreview = dynamic(() => import("@/components/atom/VideoPreview"));

type Props = {
  videoKey: string;
  localKey?: string;
  name: string;
  uploadProgress?: number;
  uploading: boolean;
};

const Video: FC<Props> = ({ name, videoKey, localKey, uploading, uploadProgress }) => {
  const [previewVideo, setPreviewVideo] = useBoolean(false);

  const percent = useMemo(() => {
    if (uploadProgress) {
      return Number((uploadProgress * 100).toFixed(2));
    }
    return 0;
  }, [uploadProgress]);

  return (
    <ItemWrapper>
      {uploading ? (
        <HStack spacing={3}>
          <Progress w={380} hasStripe isAnimated value={percent} />
          <Text color="blue.500" fontSize={"24px"} fontWeight={"600"}>{`${percent}%`}</Text>
        </HStack>
      ) : (
        <Button variant="link" onClick={setPreviewVideo.on}>
          {name}
        </Button>
      )}
      <VideoPreview
        title={name}
        localKey={localKey}
        videoKey={videoKey}
        isOpen={previewVideo}
        onClose={setPreviewVideo.off}
      />
    </ItemWrapper>
  );
};

export default memo(Video);
