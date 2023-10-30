"use client";
import React, { createContext, FC, useContext, useState } from "react";
import { Center, Flex, Grid, GridItem, Heading, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { ERROR_MESSAGES } from "@/constants/common";
import { UploadProgressType } from "@/models/common";
import { OnlineCourse } from "@/models/onlineCourses";

interface OnlineCourseState {
  data: NonNullable<OnlineCourse>;
  uploadProgress: Record<string, UploadProgressType>;
  setUploadProgress: React.Dispatch<React.SetStateAction<Record<string, UploadProgressType>>>;
}

interface Props {
  id: string;
  children?: React.ReactNode;
}

const OnlineCourseContext = createContext<OnlineCourseState>({} as OnlineCourseState);

export const OnlineCourseProvider: FC<Props> = ({ children, id }) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressType>>({});
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["online-course", id],
    queryFn: () => OnlineCourseService.getOnlineCourse(+id),
    enabled: !isNaN(+id),
  });

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="center" height={"100vh"}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    );
  }

  if ((!data && isSuccess) || !data) {
    return (
      <Center h="100vh">
        <Heading>{ERROR_MESSAGES.somethingWentWrong}</Heading>
      </Center>
    );
  }

  return (
    <OnlineCourseContext.Provider value={{ data, uploadProgress, setUploadProgress }}>
      <Grid>
        <GridItem w="100%" padding={5}>
          <Heading textAlign="center">{data.name}</Heading>
          <Flex flexDirection="column" paddingTop={10}>
            {children}
          </Flex>
        </GridItem>
      </Grid>
    </OnlineCourseContext.Provider>
  );
};

export const useOnlineCourse = () => useContext(OnlineCourseContext);
