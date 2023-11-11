import React, { FC, memo, useCallback } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import SharedAlertDialog from "@/components/molecule/SharedAlertDialog";
import { colors } from "@/constants/chakra";
import { refetchOnlineCourseById } from "@/helpers/queryClient";
import { EditOnlineCourseLevelValidation } from "@/validation/online-courses";
import ItemWrapper from "./ItemWrapper";
import EditableCustom from "../EditableCustom";

type Props = {
  id: number;
  level: string;
  onlineCourseId: number;
  children: React.ReactNode;
};

const resolver = classValidatorResolver(EditOnlineCourseLevelValidation);

const Level: FC<Props> = ({ id, level, onlineCourseId, children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryClient = useQueryClient();
  const { control, handleSubmit, setValue } = useForm<EditOnlineCourseLevelValidation>({
    defaultValues: { level, id },
    resolver,
  });

  const onSuccess = useCallback(
    async () => await refetchOnlineCourseById(queryClient, onlineCourseId),
    [onlineCourseId, queryClient],
  );

  const { mutate } = useMutation<number, { message: string }, EditOnlineCourseLevelValidation>(
    OnlineCourseService.editOnlineCourseLevel,
    { onSuccess },
  );

  const { mutate: deleteLevel, isLoading } = useMutation<number, { message: string }>(
    () => OnlineCourseService.deleteOnlineCourseLevel(id),
    { onSuccess },
  );

  const onEdit: SubmitHandler<EditOnlineCourseLevelValidation> = useCallback(
    data => mutate(data),
    [mutate],
  );

  const onCancel = useCallback((prevState: string) => setValue("level", prevState), [setValue]);

  return (
    <ItemWrapper>
      <Box borderBottom={`2px solid ${colors.blue[500]}`}>
        <HStack>
          <Controller
            name="level"
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                Level -
                <EditableCustom
                  value={value}
                  onChange={onChange}
                  onCancel={onCancel}
                  onSubmit={handleSubmit(onEdit)}
                />
              </>
            )}
          />
          <IconButton
            size="sm"
            aria-label="add"
            icon={<DeleteIcon />}
            colorScheme="red"
            fontSize="20px"
            onClick={onOpen}
          />
        </HStack>
        {children}
      </Box>
      <SharedAlertDialog
        isOpen={isOpen}
        isLoading={isLoading}
        title={`Delete level - ${level}`}
        onClose={onClose}
        deleteFn={deleteLevel}
      />
    </ItemWrapper>
  );
};

export default memo(Level);
