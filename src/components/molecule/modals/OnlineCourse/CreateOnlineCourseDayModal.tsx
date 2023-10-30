import { FC, memo, useCallback } from "react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { FormInput } from "@/components/atom";
import SharedModal from "@/components/molecule/SharedModal";
import { refetchOnlineCourseById } from "@/helpers/queryClient";
import { CreateOnlineCourseDayValidation } from "@/validation/online-courses";

type Props = {
  onClose: () => void;
  onlineCourseId: number;
  levelId: number;
};

const resolver = classValidatorResolver(CreateOnlineCourseDayValidation);

const CreateOnlineCourseDayModal: FC<Props> = ({ levelId, onlineCourseId, onClose }) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateOnlineCourseDayValidation>({
    defaultValues: { label: "", onlineCourseLevelId: levelId, onlineCourseId },
    resolver,
  });

  const onSuccess = useCallback(async () => {
    await refetchOnlineCourseById(queryClient, onlineCourseId);
    onClose();
  }, [onClose, onlineCourseId, queryClient]);

  const { mutate, isLoading } = useMutation<
    number,
    { message: string },
    CreateOnlineCourseDayValidation
  >(OnlineCourseService.createOnlineCourseDay, { onSuccess });

  return (
    <SharedModal
      isOpen
      title="Add Day"
      action={handleSubmit(useCallback(data => mutate(data), [mutate]))}
      actionButtonText="Create"
      onClose={onClose}
      isLoading={isLoading}
      actionButtonDisabled={!isDirty}>
      <Controller
        name="label"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors.label?.message}
            name="label"
            type="text"
            formLabelName="Day"
            value={value}
            placeholder="Day 1"
            handleInputChange={onChange}
            formErrorMessage={errors.label?.message}
          />
        )}
      />
    </SharedModal>
  );
};

export default memo(CreateOnlineCourseDayModal);
