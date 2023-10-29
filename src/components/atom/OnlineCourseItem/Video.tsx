import React, { FC, memo } from "react";
import { Heading } from "@chakra-ui/react";
import ItemWrapper from "./ItemWrapper";

type Props = {
  video: string;
};

const Video: FC<Props> = ({ video }) => {
  return (
    <ItemWrapper>
      <Heading size="lg">{video}</Heading>
    </ItemWrapper>
  );
};

export default memo(Video);
