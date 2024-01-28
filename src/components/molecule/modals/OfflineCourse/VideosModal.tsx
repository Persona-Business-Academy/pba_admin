import { FC, memo, useCallback, useLayoutEffect, useMemo, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { HStack, List, ListIcon, ListItem } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { UploadFile, Video } from "@/components/atom";
import { generateFileNames, uploadDocumentToAWS } from "@/utils/helpers/uploadFile";
import { Maybe } from "@/utils/models/common";
import { OfflineCourseVideoModel } from "@/utils/models/offlineCourses";
import { AddOfflineCourseVideosValidation } from "@/utils/validation/offline-courses";
import SharedModal from "../../SharedModal";

type Props = {
  onClose: () => void;
  offlineCourseId: number;
  mediaId: string;
  videos: OfflineCourseVideoModel[];
  refetch: () => void;
};

const VideosModal: FC<Props> = ({ onClose, offlineCourseId, mediaId, videos, refetch }) => {
  const memoizedData = useMemo(
    () => videos.map(item => ({ ...item, uploading: false, progress: 0 })),
    [videos],
  );

  const [localVideos, setLocalVideos] = useState(memoizedData);

  const { mutate: add, isLoading: addLoading } = useMutation<
    OfflineCourseVideoModel,
    { message: string },
    AddOfflineCourseVideosValidation
  >(OfflineCourseService.addVideo, {
    onSuccess(_, variables) {
      setLocalVideos(prevData => prevData.filter(({ key }) => key !== variables.key));
      refetch();
    },
  });

  const { mutate: remove, isLoading: removeLoading } = useMutation<
    OfflineCourseVideoModel,
    { message: string },
    { id: number }
  >(OfflineCourseService.removeVideo, { onSuccess: () => refetch() });

  const submitHandler = useCallback(
    async (files?: Maybe<FileList>) => {
      if (!files?.length) return;

      const localFileName = files[0].name;
      const nameForAWS = generateFileNames(mediaId, "OfflineCourseAbout");

      setLocalVideos(prevData => [
        ...prevData,
        {
          id: Date.now(),
          name: `Uploading ${localFileName}`,
          key: nameForAWS,
          offlineCourseId,
          createdAt: new Date(),
          updatedAt: new Date(),
          uploading: true,
          progress: 0,
        },
      ]);

      const res = await uploadDocumentToAWS({
        file: files[0],
        fileName: nameForAWS,
        handleUploadProgress: ({ progress, key }) =>
          setLocalVideos(prevData =>
            prevData.map(item => {
              if (item.key === key) {
                return { ...item, progress };
              }
              return item;
            }),
          ),
      });
      add({ key: res.key, name: localFileName, offlineCourseId });
    },
    [add, mediaId, offlineCourseId],
  );

  useLayoutEffect(() => {
    setLocalVideos(memoizedData);
  }, [memoizedData]);

  return (
    <SharedModal
      isOpen
      size="2xl"
      title="OfflineCourse videos"
      onClose={onClose}
      isLoading={addLoading || removeLoading}>
      <UploadFile content="Videos" changeHandler={submitHandler} accept="video/*" />
      <List spacing={3}>
        {localVideos.map(({ id, key, name, uploading, progress }) => (
          <ListItem
            key={id}
            fontWeight="bold"
            borderRadius={6}
            padding={2}
            transition={"all 0.3s"}
            _hover={{ background: "gray.100" }}>
            <HStack>
              <Video name={name} videoKey={key} uploadProgress={progress} uploading={uploading} />
              {!uploading && (
                <ListIcon
                  as={DeleteIcon}
                  color="red.500"
                  cursor={"pointer"}
                  onClick={() => remove({ id })}
                />
              )}
            </HStack>
          </ListItem>
        ))}
      </List>
    </SharedModal>
  );
};

export default memo(VideosModal);
