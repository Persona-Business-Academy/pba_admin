import React, { FC, memo } from "react";
import { Heading } from "@chakra-ui/react";
import ItemWrapper from "./ItemWrapper";

type Props = {
  videoKey: string;
};

const Video: FC<Props> = ({ videoKey }) => {
  return (
    <ItemWrapper>
      <Heading size="lg">{videoKey}</Heading>
    </ItemWrapper>
  );
};

export default memo(Video);
