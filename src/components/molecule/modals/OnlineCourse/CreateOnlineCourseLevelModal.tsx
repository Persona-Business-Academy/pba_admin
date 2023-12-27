import { FC, memo, useCallback } from "react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { FormInput } from "@/components/atom";
import { refetchOnlineCourseById } from "@/utils/helpers/queryClient";
import { CreateOnlineCourseLevelValidation } from "@/utils/validation/online-courses";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  onlineCourseId: number;
  onClose: () => void;
};

const resolver = classValidatorResolver(CreateOnlineCourseLevelValidation);

const CreateOnlineCourseLevelModal: FC<Props> = ({ onlineCourseId, onClose }) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateOnlineCourseLevelValidation>({
    defaultValues: { level: "", onlineCourseId },
    resolver,
  });

  const onSuccess = useCallback(async () => {
    await refetchOnlineCourseById(queryClient, onlineCourseId);
    onClose();
  }, [onClose, onlineCourseId, queryClient]);

  const { mutate, isLoading } = useMutation<
    number,
    { message: string },
    CreateOnlineCourseLevelValidation
  >(OnlineCourseService.createOnlineCourseLevel, { onSuccess });

  return (
    <SharedModal
      isOpen
      title="Add Level"
      action={handleSubmit(useCallback(data => mutate(data), [mutate]))}
      actionButtonText="Create"
      onClose={onClose}
      isLoading={isLoading}
      actionButtonDisabled={!isDirty}>
      <Controller
        name="level"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors.level?.message}
            name="name"
            type="text"
            formLabelName="Name"
            value={value}
            placeholder="React.js course"
            handleInputChange={onChange}
            formErrorMessage={errors.level?.message}
          />
        )}
      />
    </SharedModal>
  );
};

export default memo(CreateOnlineCourseLevelModal);
