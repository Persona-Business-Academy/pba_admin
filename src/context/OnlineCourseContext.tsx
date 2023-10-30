"use client";
import React, { createContext, FC, useContext } from "react";
import { Center, Flex, Grid, GridItem, Heading, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { ERROR_MESSAGES } from "@/constants/common";
import { QUERY_KEY } from "@/helpers/queryClient";
import { OnlineCourse } from "@/models/onlineCourses";

interface OnlineCourseState {
  data: NonNullable<OnlineCourse>;
}

interface Props {
  id: string;
  children?: React.ReactNode;
}

const OnlineCourseContext = createContext<OnlineCourseState>({} as OnlineCourseState);

export const OnlineCourseProvider: FC<Props> = ({ children, id }) => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: QUERY_KEY.onlineCourse(+id),
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
    <OnlineCourseContext.Provider value={{ data }}>
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
