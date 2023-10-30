import React, { FC, memo, useCallback } from "react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
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

  const onSubmit: SubmitHandler<EditOnlineCourseLevelValidation> = useCallback(
    data => mutate(data),
    [mutate],
  );

  const onCancel = useCallback((prevState: string) => setValue("level", prevState), [setValue]);

  return (
    <ItemWrapper>
      <Controller
        name="level"
        control={control}
        render={({ field: { onChange, value } }) => (
          <EditableCustom
            value={value}
            onChange={onChange}
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
          />
        )}
      />
      {children}
    </ItemWrapper>
  );
};

export default memo(Level);
