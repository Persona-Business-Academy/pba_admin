"use client";
import React, { useCallback, useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
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
import { FormInput, FormTextarea } from "@/components/atom";
import { EditCommentsModal } from "@/components/molecule";
import { useOnlineCourse } from "@/contexts/OnlineCourseContext";
import { generateAWSUrl } from "@/utils/helpers/common";
import { CommentFormData, CommentModel } from "@/utils/models/comments";
import { Maybe } from "@/utils/models/common";
import { CreateEditCommentsValidation } from "@/utils/validation/comments";

export default function OnlineCourseComments() {
  const { data: onlineCourse } = useOnlineCourse();
  const [selectedComment, setSelectedComment] = useState<Maybe<CommentModel>>(null);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["course-comments", onlineCourse.id],
    queryFn: () => CommentService.getCourseComments({ courseId: onlineCourse.id, type: "online" }),
    enabled: !!onlineCourse.id,
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
      createComment({ headline, text, courseType: "online", courseId: onlineCourse.id });
      reset();
    },
    [createComment, onlineCourse.id, reset],
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
}
