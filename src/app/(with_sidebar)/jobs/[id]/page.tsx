"use client";
import React, { useMemo } from "react";
import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { JobService } from "@/api/services/JobService";
import { QUERY_KEY } from "@/utils/helpers/queryClient";
import { JobModel } from "@/utils/models/job";

const titleByValue: Record<keyof NonNullable<JobModel>, string> = {
  title: "Title",
  salary: "Salary",
  workingHours: "Working hours",
  contractType: "Contract type",
  description: "Description",
  responsibilities: "Responsibilities",
  requirements: "Requirements",
  id: "",
  disabled: "",
  createdAt: "",
  updatedAt: "",
};

export default function Job() {
  const params = useParams<{ id: string }>();

  const jobId = useMemo(() => {
    const id = +(params?.id || "");
    if (typeof id === "number" && !isNaN(id)) {
      return id;
    }
    return "";
  }, [params?.id]);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY.job(+jobId),
    queryFn: () => JobService.getById(+jobId),
    enabled: !!jobId,
  });

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="center" minHeight="500px">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Box p={10}>
      {Object.entries(titleByValue).map(item => {
        if (!item[1]) {
          return null;
        }
        return (
          <Box key={item[0]} pt={10}>
            <Heading as="h3" size="md">
              {item[1]}
            </Heading>
            <Text fontSize={18} pl={5} pt={2}>
              {data?.[item[0] as keyof JobModel]}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
