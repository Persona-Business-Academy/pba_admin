"use client";
import { useMemo } from "react";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ApplicantService } from "@/api/services/ApplicantService";
import { generateAWSUrl } from "@/utils/helpers/common";
import { QUERY_KEY } from "@/utils/helpers/queryClient";
import { ApplicantModel } from "@/utils/models/common";

const titleByValue: Record<keyof NonNullable<ApplicantModel>, string> = {
  createdAt: "Created",
  name: "Name",
  email: "Email",
  phoneNumber: "Phone Number",
  attachment: "Attachment",
  company: "Company",
  message: "Message",
  motivationLetter: "Motivation letter",
  hasAgreedToPrivacyPolicy: "Has agreed to privacy policy",
  for: "For",
  courseDesiredStartTime: "Course Desired Start Time",
  courseDesiredEndTime: "Course Desired End Time",
  jobId: "",
  offlineCourseId: "",
  id: "",
  updatedAt: "",
  file: "",
};

export default function Applicant() {
  const params = useParams<{ id: string }>();

  const applicantId = useMemo(() => {
    const id = +(params?.id || "");
    if (typeof id === "number" && !isNaN(id)) {
      return id;
    }
    return "";
  }, [params?.id]);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY.applicant(+applicantId),
    queryFn: () => ApplicantService.getById(+applicantId),
    enabled: !!applicantId,
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
        const value = data?.[item[0] as keyof ApplicantModel];
        return (
          <Box key={item[0]} pt={10}>
            <Heading as="h3" size="md">
              {item[1]}
            </Heading>
            {item[0] === "attachment" && value ? (
              <Button as={Link} href={generateAWSUrl(value)} target="_blank">
                {"File >"}
              </Button>
            ) : (
              <Text fontSize={18} pl={5} pt={2}>
                {value || "-"}
              </Text>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
