import { FC, memo, useCallback } from "react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { queryClient } from "@/app/providers";
import { FormInput } from "@/components/atom";
import SharedModal from "@/components/molecule/SharedModal";
import { CreateEditOnlineCourseLevelValidation } from "@/validation/online-courses";

type Props = {
  onlineCourseId: number;
  onClose: () => void;
};

const resolver = classValidatorResolver(CreateEditOnlineCourseLevelValidation);

const AddEditOnlineCourseLevelModal: FC<Props> = ({ onlineCourseId, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateEditOnlineCourseLevelValidation>({
    defaultValues: { level: "", onlineCourseId },
    resolver,
  });

  const onSuccess = useCallback(async () => {
    await queryClient.refetchQueries({
      queryKey: ["online-course", onlineCourseId.toString()],
      type: "active",
      exact: true,
    });
    onClose();
  }, [onClose, onlineCourseId]);

  const { mutate, isLoading } = useMutation<
    number,
    { message: string },
    CreateEditOnlineCourseLevelValidation
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

export default memo(AddEditOnlineCourseLevelModal);
