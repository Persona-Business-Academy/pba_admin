import React, { FC, memo } from "react";
import { Box, Heading, HStack, IconButton } from "@chakra-ui/react";
import { BsPlusCircleFill } from "react-icons/bs";

type Props = {
  title: string;
  children: React.ReactNode;
  onBtnClick: () => {};
};

const OnlineCourseItem: FC<Props> = ({ title, children, onBtnClick }) => {
  return (
    <Box>
      <HStack spacing={5} paddingY={5}>
        <Heading as="h4" size="lg" color="blue.500">
          {title}
        </Heading>
        <IconButton
          isRound
          aria-label="add"
          icon={<BsPlusCircleFill />}
          colorScheme="blue"
          fontSize="20px"
          onClick={onBtnClick}
        />
      </HStack>
      {children}
    </Box>
  );
};

export default memo(OnlineCourseItem);
