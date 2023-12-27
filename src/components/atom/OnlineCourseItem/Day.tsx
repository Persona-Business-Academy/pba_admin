import React, { FC, memo, useCallback } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { refetchOnlineCourseById } from "@/utils/helpers/queryClient";
import { EditOnlineCourseDayValidation } from "@/utils/validation/online-courses";
import ItemWrapper from "./ItemWrapper";
import EditableCustom from "../EditableCustom";

const SharedAlertDialog = dynamic(() => import("@/components/molecule/SharedAlertDialog"));

type Props = {
  id: number;
  onlineCourseId: number;
  day: string;
  children: React.ReactNode;
};

const resolver = classValidatorResolver(EditOnlineCourseDayValidation);

const Day: FC<Props> = ({ id, onlineCourseId, day, children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryClient = useQueryClient();
  const { control, setValue, handleSubmit } = useForm<EditOnlineCourseDayValidation>({
    defaultValues: { label: day, id },
    resolver,
  });

  const onSuccess = useCallback(
    async () => await refetchOnlineCourseById(queryClient, onlineCourseId),
    [onlineCourseId, queryClient],
  );

  const { mutate } = useMutation<number, { message: string }, EditOnlineCourseDayValidation>(
    OnlineCourseService.editOnlineCourseDay,
    { onSuccess },
  );

  const onCancel = useCallback((prevValue: string) => setValue("label", prevValue), [setValue]);

  const onSubmit: SubmitHandler<EditOnlineCourseDayValidation> = useCallback(
    data => mutate(data),
    [mutate],
  );

  const { mutate: deleteDay, isLoading } = useMutation<number, { message: string }>(
    () => OnlineCourseService.deleteOnlineCourseDay(id),
    { onSuccess },
  );

  return (
    <ItemWrapper>
      <HStack>
        <Controller
          name="label"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              Day -
              <EditableCustom
                value={value}
                onChange={onChange}
                onCancel={onCancel}
                onSubmit={handleSubmit(onSubmit)}
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
      <SharedAlertDialog
        isOpen={isOpen}
        isLoading={isLoading}
        title={`Delete day - ${day}`}
        onClose={onClose}
        deleteFn={deleteDay}
      />
    </ItemWrapper>
  );
};

export default memo(Day);
