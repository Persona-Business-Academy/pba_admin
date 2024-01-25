import { FC, memo, useCallback, useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Center, Fade, HStack, IconButton, Text, useToast } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { UploadFile } from "@/components/atom";
import { colors } from "@/utils/constants/chakra";
import { generateAWSUrl } from "@/utils/helpers/common";
import { QUERY_KEY } from "@/utils/helpers/queryClient";
import {
  generateOfflineCourseGraduationPhotoName,
  uploadDocumentToAWS,
} from "@/utils/helpers/uploadFile";
import { Maybe } from "@/utils/models/common";
import { EditOfflineCourseValidation } from "@/utils/validation/offline-courses";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  offlineCourseId: number;
  onClose: () => void;
};

const GraduationPhotoModal: FC<Props> = ({ offlineCourseId, onClose }) => {
  const [localImage, setLocalImage] = useState<Maybe<{ file: File; localUrl: string }>>(null);
  const [photo, setPhoto] = useState<string>();
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const toast = useToast();

  const { data: offlineCourse } = useQuery({
    queryKey: QUERY_KEY.offlineCourse(offlineCourseId),
    queryFn: () => OfflineCourseService.getOfflineCourse(offlineCourseId),
    enabled: !!offlineCourseId,
  });

  const onFileSelect = useCallback((files: Maybe<FileList>) => {
    if (files?.length) {
      setLocalImage({ file: files[0], localUrl: URL.createObjectURL(files[0]) });
    }
  }, []);

  const removeCoverPhoto = useCallback(() => setLocalImage(null), []);

  const { mutate, isLoading } = useMutation<
    number,
    { message: string },
    EditOfflineCourseValidation
  >(data => OfflineCourseService.editOfflineCourse(offlineCourse?.id!, data), {
    onError: () => setFileLoading(false),
    onSuccess: () => onClose(),
  });

  const onSubmit = useCallback(async () => {
    console.log("object");
    if (localImage?.file && offlineCourse) {
      if (localImage.file.size > 3 * 1024 * 1024) {
        return toast({
          title: "File size too large. Maximum size allowed is 3mb",
          status: "warning",
        });
      }
      setFileLoading(true);
      const res = await uploadDocumentToAWS({
        file: localImage.file,
        fileName: generateOfflineCourseGraduationPhotoName(offlineCourse.mediaId),
      });
      mutate({ graduationPhoto: res.key });
    }
  }, [localImage?.file, mutate, offlineCourse, toast]);

  useEffect(() => {
    if (offlineCourse?.graduationPhoto) {
      setPhoto(offlineCourse.graduationPhoto);
    }
  }, [offlineCourse?.graduationPhoto]);

  return (
    <SharedModal
      isOpen
      size="2xl"
      title={"Add graduation photo"}
      action={onSubmit}
      actionButtonText={"Save"}
      onClose={onClose}
      actionButtonDisabled={!localImage}
      isLoading={isLoading || fileLoading}>
      <HStack>
        <UploadFile
          content={
            localImage?.localUrl || photo ? (
              <Fade in>
                <Image
                  priority
                  src={localImage?.localUrl || generateAWSUrl(photo!)}
                  width={500}
                  height={500}
                  style={{
                    width: 500,
                    height: 500,
                    borderRadius: 6,
                    backgroundColor: "gray.200",
                    objectFit: "cover",
                  }}
                  alt="Avatar"
                />
              </Fade>
            ) : (
              <Fade in>
                <Center boxSize={"500px"} borderRadius={6} border={`2px solid ${colors.blue[500]}`}>
                  <Text color="blue.500">No photo</Text>
                </Center>
              </Fade>
            )
          }
          changeHandler={onFileSelect}
          accept="image/*"
        />
        <Fade in={!!localImage?.localUrl}>
          <IconButton
            aria-label="remove local photo"
            icon={<DeleteIcon />}
            onClick={removeCoverPhoto}
          />
        </Fade>
      </HStack>
    </SharedModal>
  );
};

export default memo(GraduationPhotoModal);
