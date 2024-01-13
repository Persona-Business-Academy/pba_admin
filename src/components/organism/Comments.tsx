import { FC, memo, useCallback, useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Center,
  HStack,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CommentService } from "@/api/services/CommentService";
import { generateAWSUrl } from "@/utils/helpers/common";
import { QUERY_KEY } from "@/utils/helpers/queryClient";
import { CommentFormData, CommentModel } from "@/utils/models/comments";
import { CourseType, Maybe } from "@/utils/models/common";
import { CreateEditCommentsValidation } from "@/utils/validation/comments";
import { Button, FormInput, FormTextarea } from "../atom";
import EditCommentsModal from "../molecule/modals/Comments/EditCommentsModal";

interface Props {
  courseId: number;
  courseType: CourseType;
}

const Comments: FC<Props> = ({ courseId, courseType }) => {
  const [selectedComment, setSelectedComment] = useState<Maybe<CommentModel>>(null);

  const { data, refetch, isLoading } = useQuery({
    queryKey: QUERY_KEY.comments(courseId, courseType),
    queryFn: () => CommentService.getCourseComments({ courseId, type: courseType }),
  });

  const { mutate: createComment } = useMutation<
    CommentModel,
    { message: string },
    CreateEditCommentsValidation
  >(CommentService.create, { onSuccess: () => refetch() });

  const { mutate: deleteComment } = useMutation<CommentModel, { message: string }, number>(
    CommentService.delete,
    { onSuccess: () => refetch() },
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({ defaultValues: { text: "", headline: "" } });

  const onCreate: SubmitHandler<CommentFormData> = useCallback(
    ({ headline, text }) => {
      createComment({ headline, text, courseType, courseId });
      reset();
    },
    [courseId, courseType, createComment, reset],
  );

  return (
    <Center>
      <VStack w={500}>
        {!data?.length ? (
          isLoading ? (
            <Spinner />
          ) : (
            <VStack>
              <Text>No data yet</Text>
            </VStack>
          )
        ) : (
          <List spacing={3}>
            {data.map(item => {
              const { id, headline, text, author, authorAdmin } = item;
              const creator = author || authorAdmin;
              const avatar = author?.avatar;
              return (
                <ListItem
                  key={id}
                  fontWeight="bold"
                  borderRadius={6}
                  padding={2}
                  transition={"all 0.3s"}
                  _hover={{ background: "gray.100" }}>
                  <HStack>
                    <Avatar
                      bgColor="blue.100"
                      name={creator?.firstName + " " + creator?.lastName}
                      src={avatar ? generateAWSUrl(avatar) : ""}
                    />
                    <VStack w={500} alignItems="flex-start">
                      <Text fontSize={16}>{headline}</Text>
                      <Text fontSize={12}>{text}</Text>
                    </VStack>
                    <ListIcon
                      as={EditIcon}
                      color="blue.500"
                      cursor={"pointer"}
                      onClick={() => setSelectedComment(item)}
                    />
                    <ListIcon
                      as={DeleteIcon}
                      color="red.500"
                      cursor={"pointer"}
                      onClick={() => deleteComment(id)}
                    />
                  </HStack>
                </ListItem>
              );
            })}
          </List>
        )}
        <Box mt={10} w={"100%"}>
          <Controller
            name="headline"
            control={control}
            rules={{ required: "Headline is required" }}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isInvalid={!!errors[name]?.message}
                name={name}
                type="text"
                value={value}
                placeholder="Headline"
                handleInputChange={onChange}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />
          <Controller
            name="text"
            control={control}
            rules={{ required: "Comment is required" }}
            render={({ field: { onChange, value, name } }) => (
              <FormTextarea
                isInvalid={!!errors[name]?.message}
                name={name}
                value={value}
                placeholder="Type something..."
                handleInputChange={onChange}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />
          <Button onClick={handleSubmit(onCreate)}>Create</Button>
        </Box>
      </VStack>
      {!!selectedComment && (
        <EditCommentsModal
          isOpen
          comment={selectedComment}
          onClose={() => setSelectedComment(null)}
          onSave={refetch}
        />
      )}
    </Center>
  );
};

export default memo(Comments);
