"use client";
import React from "react";
import { Center, Flex, Grid, GridItem, Heading, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { Day, Level, Video } from "@/components/atom";
import { OnlineCourseItemHeading } from "@/components/organism";
import { ERROR_MESSAGES } from "@/constants/common";

type Props = { params: { id: string } };

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
          <OnlineCourseItemHeading title="Levels" type="levels" onlineCourseId={data.id}>
            {data.levels.map(({ id: levelId, level, days }) => {
              return (
                <Level
                  key={`${level}-${levelId}`}
                  id={levelId}
                  level={level}
                  onlineCourseId={data.id}>
                  <OnlineCourseItemHeading
                    title="Days"
                    type="days"
                    onlineCourseId={data.id}
                    levelId={levelId}>
                    {days.map(({ id: dayId, label, videos }) => {
                      return (
                        <Day
                          key={`${label}-${dayId}`}
                          id={dayId}
                          day={label}
                          onlineCourseId={data.id}>
                          <OnlineCourseItemHeading
                            title="Videos"
                            type="videos"
                            onlineCourseId={data.id}
                            levelId={levelId}
                            dayId={dayId}>
                            {videos.map(({ id: videoId, key }) => {
                              return <Video key={`${key}-${videoId}`} video={key} />;
                            })}
                          </OnlineCourseItemHeading>
                        </Day>
                      );
                    })}
                  </OnlineCourseItemHeading>
                </Level>
              );
            })}
          </OnlineCourseItemHeading>
        </Flex>
      </GridItem>
    </Grid>
  );
}
