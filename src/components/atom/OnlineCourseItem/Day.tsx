import React, { FC, memo } from "react";
import { Heading } from "@chakra-ui/react";
import ItemWrapper from "./ItemWrapper";

type Props = {
  day: string;
  children: React.ReactNode;
};

const Day: FC<Props> = ({ day, children }) => {
  return (
    <ItemWrapper>
      <Heading size="lg">{day}</Heading>
      {children}
    </ItemWrapper>
  );
};

export default memo(Day);
