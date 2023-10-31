import { FC, memo, useCallback } from "react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { FormInput } from "@/components/atom";
import { Maybe } from "@/models/common";
import { OnlineCourse } from "@/models/onlineCourses";
import { CreateEditOnlineCourseValidation } from "@/validation/online-courses";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onlineCourse: Maybe<OnlineCourse>;
};

const resolver = classValidatorResolver(CreateEditOnlineCourseValidation);

const CreateEditOnlineCourseModal: FC<Props> = ({ onlineCourse, isOpen, onClose, onSave }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateEditOnlineCourseValidation>({
    defaultValues: { name: !!onlineCourse ? onlineCourse.name : "" },
    resolver,
  });

  const { mutate, isLoading } = useMutation<
    number,
    { message: string },
    CreateEditOnlineCourseValidation
  >(
    !!onlineCourse
      ? data => OnlineCourseService.editOnlineCourse(onlineCourse.id, data)
      : OnlineCourseService.createOnlineCourse,
    {
      onSuccess: async () => {
        onSave();
        onClose();
      },
    },
  );

  return (
    <SharedModal
      isOpen={isOpen}
      title={`${!!onlineCourse ? "Edit" : "Create"} Online Course`}
      action={handleSubmit(useCallback(data => mutate(data), [mutate]))}
      actionButtonText={!!onlineCourse ? "Save" : "Create"}
      onClose={onClose}
      isLoading={isLoading}
      actionButtonDisabled={!isDirty}>
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors.name?.message}
            name="name"
            type="text"
            formLabelName="Name"
            value={value}
            placeholder="React.js course"
            handleInputChange={onChange}
            formErrorMessage={errors.name?.message}
          />
        )}
      />
    </SharedModal>
  );
};

export default memo(CreateEditOnlineCourseModal);
