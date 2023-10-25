"use client";
import { ReactNode, useCallback, useMemo } from "react";
import { Center, Flex, Grid, GridItem, Heading, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { OnlineCourseItem } from "@/components/organism";
import { ERROR_MESSAGES } from "@/constants/common";
import { OnlineCourseType } from "@/models/onlineCourses";

type Items = Array<{ title: string; type: OnlineCourseType; children: ReactNode }>;
type Props = { params: { id: string } };

export default function OnlineCourses({ params }: Props) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["online-course", params.id],
    queryFn: () => OnlineCourseService.getOnlineCourse(+params.id),
    enabled: !isNaN(+params.id),
  });

  const items: Items = useMemo(
    () => [
      { title: "Levels", type: "levels", children: "Levels" },
      { title: "Days", type: "days", children: "Days" },
      { title: "Videos", type: "videos", children: "Videos" },
    ],
    [],
  );

  const renderItems = useCallback(
    (item: (typeof items)[0]) => <OnlineCourseItem key={item.type} {...item} />,
    [],
  );

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="center" height={"100vh"}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    );
  }

  if (!data && isSuccess) {
    return (
      <Center h="100vh">
        <Heading>{ERROR_MESSAGES.somethingWentWrong}</Heading>
      </Center>
    );
  }

  return (
    <Grid>
      <GridItem w="100%" padding={5}>
        <Heading textAlign="center">{data?.name}</Heading>
        <Flex flexDirection="column" alignItems="center" paddingTop={10}>
          {items.map(renderItems)}
        </Flex>
      </GridItem>
    </Grid>
  );
}
