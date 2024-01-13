"use client";
import React, { createContext, FC, memo, PropsWithChildren, useContext } from "react";
import { Center, Flex, Grid, GridItem, Heading, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { ERROR_MESSAGES } from "@/utils/constants/common";
import { QUERY_KEY } from "@/utils/helpers/queryClient";
import { OfflineCourse } from "@/utils/models/offlineCourses";

interface OfflineCourseState {
  data: NonNullable<OfflineCourse>;
}

interface Props {
  id: string;
}

const OfflineCourseContext = createContext<OfflineCourseState>({} as OfflineCourseState);

const OfflineCourseProvider: FC<PropsWithChildren<Props>> = ({ children, id }) => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: QUERY_KEY.offlineCourse(+id),
    queryFn: () => OfflineCourseService.getOfflineCourse(+id),
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
    <OfflineCourseContext.Provider value={{ data }}>
      <Grid>
        <GridItem w="100%" padding={5}>
          <Heading textAlign="center">{data.title}</Heading>
          <Flex flexDirection="column" paddingTop={10}>
            {children}
          </Flex>
        </GridItem>
      </Grid>
    </OfflineCourseContext.Provider>
  );
};

export const useOfflineCourse = () => useContext(OfflineCourseContext);

export default memo(OfflineCourseProvider);
