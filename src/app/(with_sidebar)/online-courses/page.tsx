"use client";
import { useCallback, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { UploadFile } from "@/components/atom";
import { uploadDocumentToAWS } from "@/helpers/uploadFile";
import { Maybe, UploadProgressType } from "@/models/common";

export default function OnlineCourses() {
  const [_, setUploadProgress] = useState<Record<string, UploadProgressType>>(
    {}
  );

  const handleUploadProgress = useCallback(
    ({ fileName, progress }: UploadProgressType) =>
      setUploadProgress({ [fileName]: { fileName, progress } }),
    []
  );

  const changeHandler = useCallback(
    async (files: Maybe<FileList>) => {
      if (!files?.length) return;

      await uploadDocumentToAWS({
        file: files[0],
        fileName: "barev",
        handleUploadProgress,
      });
    },
    [handleUploadProgress]
  );

  return (
    <Flex flexDirection="column" alignItems="center">
      <UploadFile changeHandler={changeHandler} />
    </Flex>
  );
}
