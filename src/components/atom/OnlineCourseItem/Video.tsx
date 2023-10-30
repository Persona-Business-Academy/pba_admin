import React, { FC, memo, useCallback, useMemo, useState } from "react";
import { Button, HStack, Progress, Text } from "@chakra-ui/react";
import VideoPreview from "@/components/atom/VideoPreview";
import ItemWrapper from "./ItemWrapper";

type Props = {
  videoKey: string;
  name: string;
  uploadProgress?: number;
  uploading: boolean;
};

const Video: FC<Props> = ({ name, videoKey, uploading, uploadProgress }) => {
  const [previewVideo, setPreviewVideo] = useState(false);

  const percent = useMemo(() => {
    if (uploadProgress) {
      return Number((uploadProgress * 100).toFixed(2));
    }
    return 0;
  }, [uploadProgress]);

  const open = useCallback(() => setPreviewVideo(true), []);
  const close = useCallback(() => setPreviewVideo(false), []);

  return (
    <ItemWrapper>
      {uploading ? (
        <HStack spacing={3}>
          <Progress w={380} hasStripe isAnimated value={percent} />
          <Text color="blue.500" fontSize={"24px"} fontWeight={"600"}>{`${percent}%`}</Text>
        </HStack>
      ) : (
        <Button variant="link" onClick={open}>
          {name}
        </Button>
      )}
      {previewVideo && <VideoPreview title={name} videoKey={videoKey} onClose={close} />}
    </ItemWrapper>
  );
};

export default memo(Video);
