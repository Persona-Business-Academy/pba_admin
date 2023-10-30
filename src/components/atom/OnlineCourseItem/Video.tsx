import React, { FC, memo, useMemo } from "react";
import { HStack, Progress, Text } from "@chakra-ui/react";
import ItemWrapper from "./ItemWrapper";

type Props = {
  videoKey: string;
  name: string;
  uploadProgress?: number;
  uploading: boolean;
};

const Video: FC<Props> = ({ name, videoKey, uploading, uploadProgress }) => {
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
        <Text>
          {name} - {videoKey}
        </Text>
      )}
    </ItemWrapper>
  );
};

export default memo(Video);
