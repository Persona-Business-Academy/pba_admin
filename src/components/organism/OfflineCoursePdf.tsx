"use client";
import { memo, useCallback, useState } from "react";
import { Box, Button, HStack, Progress, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { UploadFile } from "@/components/atom";
import { useOfflineCourse } from "@/contexts/OfflineCourseContext";
import { generateAWSUrl } from "@/utils/helpers/common";
import { generateFileNames, uploadDocumentToAWS } from "@/utils/helpers/uploadFile";
import { Maybe, UploadFileToAwsRes } from "@/utils/models/common";
import { EditOfflineCourseValidation } from "@/utils/validation/offline-courses";

const OfflineCoursePdf = () => {
  const { data: offlineCourse } = useOfflineCourse();
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [pdf, setPdf] = useState<Maybe<UploadFileToAwsRes>>(null);

  const { mutateAsync } = useMutation<number, { message: string }, EditOfflineCourseValidation>(
    data => OfflineCourseService.editOfflineCourse(offlineCourse.id, data),
  );

  const submitHandler = useCallback(
    async (files?: Maybe<FileList>) => {
      try {
        setUploading(true);
        if (!files?.length) return;
        const nameForAWS = generateFileNames(offlineCourse.mediaId, "OfflineCoursePdf");

        const res = await uploadDocumentToAWS({
          file: files[0],
          fileName: nameForAWS,
          handleUploadProgress: ({ progress }) => setProgress(progress),
        });
        await mutateAsync({ pdf: res.key });
        setPdf(res);
      } catch {
        setUploading(false);
      } finally {
        setUploading(false);
      }
    },
    [mutateAsync, offlineCourse.mediaId],
  );

  return (
    <HStack>
      <UploadFile content="Upload pdf" changeHandler={submitHandler} accept="application/pdf" />
      <Box pl={5}>
        {uploading ? (
          <HStack spacing={3}>
            <Progress w={380} hasStripe isAnimated value={progress} />
            <Text color="blue.500" fontSize={"24px"} fontWeight={"600"}>{`${progress}%`}</Text>
          </HStack>
        ) : pdf || offlineCourse.pdf ? (
          <Button
            variant="link"
            as={Link}
            href={pdf?.url || generateAWSUrl(offlineCourse.pdf)}
            target="_blank">
            {pdf?.key || offlineCourse.pdf}
          </Button>
        ) : null}
      </Box>
    </HStack>
  );
};

export default memo(OfflineCoursePdf);
