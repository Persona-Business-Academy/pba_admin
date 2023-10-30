import React, { FC, memo, useCallback } from "react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { queryClient } from "@/app/providers";
import { EditOnlineCourseDayValidation } from "@/validation/online-courses";
import ItemWrapper from "./ItemWrapper";
import EditableCustom from "../EditableCustom";

type Props = {
  id: number;
  onlineCourseId: number;
  day: string;
  children: React.ReactNode;
};

const resolver = classValidatorResolver(EditOnlineCourseDayValidation);

const Day: FC<Props> = ({ id, onlineCourseId, day, children }) => {
  const { control, setValue, handleSubmit } = useForm<EditOnlineCourseDayValidation>({
    defaultValues: { label: day, id },
    resolver,
  });

  const onSuccess = useCallback(
    async () =>
      await queryClient.refetchQueries({
        queryKey: ["online-course", onlineCourseId.toString()],
        type: "active",
        exact: true,
      }),
    [onlineCourseId],
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

  return (
    <ItemWrapper>
      <Controller
        name="label"
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

export default memo(Day);
