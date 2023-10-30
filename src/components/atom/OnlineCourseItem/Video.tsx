import React, { FC, memo } from "react";
import { Heading } from "@chakra-ui/react";
import ItemWrapper from "./ItemWrapper";

type Props = {
  videoKey: string;
  name: string;
};

const Video: FC<Props> = ({ name }) => {
  return (
    <ItemWrapper>
      <Heading size="lg">{name}</Heading>
    </ItemWrapper>
  );
};

export default memo(Video);
