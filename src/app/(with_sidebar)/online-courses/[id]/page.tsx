"use client";
import React, { FC, memo } from "react";
import { Box, Center, Flex, Grid, GridItem, Heading, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { OnlineCourseItem } from "@/components/organism";
import { ERROR_MESSAGES } from "@/constants/common";

type Props = { params: { id: string } };

type ItemWrapperProps = {
  title: string;
  children: React.ReactNode;
};

const ItemWrapper: FC<ItemWrapperProps> = memo(({ title, children }) => (
  <Box paddingLeft={10}>
    <Heading size="lg">{title}</Heading>
    {children}
  </Box>
));
ItemWrapper.displayName = "ItemWrapper";

export default function OnlineCourses({ params }: Props) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["online-course", params.id],
    queryFn: () => OnlineCourseService.getOnlineCourse(+params.id),
    enabled: !isNaN(+params.id),
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
    <Grid>
      <GridItem w="100%" padding={5}>
        <Heading textAlign="center">{data?.name}</Heading>
        <Flex flexDirection="column" paddingTop={10}>
          <OnlineCourseItem title="Levels">
            {data.levels.map(({ id: levelId, level, days }) => {
              return (
                <ItemWrapper key={levelId} title={level}>
                  <OnlineCourseItem title="Days">
                    {days.map(({ id: dayId, label, videos }) => {
                      return (
                        <ItemWrapper key={`${label}-${dayId}`} title={label}>
                          <OnlineCourseItem title="Videos">
                            {videos.map(({ key, id: videoId }) => (
                              <Text key={`${key}-${videoId}`}>{key}</Text>
                            ))}
                          </OnlineCourseItem>
                        </ItemWrapper>
                      );
                    })}
                  </OnlineCourseItem>
                </ItemWrapper>
              );
            })}
          </OnlineCourseItem>
        </Flex>
      </GridItem>
    </Grid>
  );
}
