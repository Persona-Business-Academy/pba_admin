import { FC, memo, useCallback } from "react";
import { HStack } from "@chakra-ui/react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { JobService } from "@/api/services/JobService";
import { FormInput, FormTextarea } from "@/components/atom";
import { generateJobDefaultValues } from "@/utils/helpers/formData";
import { Maybe } from "@/utils/models/common";
import { JobModel } from "@/utils/models/job";
import { CreateEditJobValidation } from "@/utils/validation/jobs";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  onClose: () => void;
  onSave: () => void;
  job: Maybe<JobModel>;
};

const resolver = classValidatorResolver(CreateEditJobValidation);

const CreateEditJobModal: FC<Props> = ({ job, onClose, onSave }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateEditJobValidation>({
    defaultValues: generateJobDefaultValues(job),
    resolver,
  });

  const { mutate, isLoading } = useMutation<JobModel, { message: string }, CreateEditJobValidation>(
    !!job ? data => JobService.edit(job.id, data) : JobService.create,
    {
      onSuccess: () => {
        onSave();
        onClose();
      },
    },
  );

  const onSubmit: SubmitHandler<CreateEditJobValidation> = useCallback(
    data => {
      mutate(data);
    },
    [mutate],
  );

  return (
    <SharedModal
      size="5xl"
      isOpen
      title={`${!!job ? "Edit" : "Create"} Job`}
      action={handleSubmit(onSubmit)}
      actionButtonText={!!job ? "Save" : "Create"}
      onClose={onClose}
      isLoading={isLoading}
      actionButtonDisabled={!isDirty}>
      <Controller
        name="title"
        rules={{ required: true }}
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
            type="text"
            formLabelName="Title"
            value={value}
            placeholder="Title"
            handleInputChange={onChange}
            formErrorMessage={errors[name]?.message}
          />
        )}
      />
      <HStack>
        <Controller
          name="salary"
          rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors[name]?.message}
              name={name}
              type="text"
              formLabelName="Salary"
              value={value}
              placeholder="100000-170000"
              handleInputChange={onChange}
              formErrorMessage={errors[name]?.message}
            />
          )}
        />
        <Controller
          name="contractType"
          rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors[name]?.message}
              name={name}
              type="text"
              formLabelName="Contract type"
              value={value}
              placeholder="Full time"
              handleInputChange={onChange}
              formErrorMessage={errors[name]?.message}
            />
          )}
        />

        <Controller
          name="workingHours"
          rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors[name]?.message}
              name={name}
              type="text"
              formLabelName="Working hours"
              value={value}
              placeholder="10:00-17:00"
              handleInputChange={onChange}
              formErrorMessage={errors[name]?.message}
            />
          )}
        />
      </HStack>
      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormTextarea
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
            formLabelName="Description"
            value={value}
            placeholder="Type something..."
            handleInputChange={onChange}
            formErrorMessage={errors[name]?.message}
          />
        )}
      />
      <Controller
        name="responsibilities"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormTextarea
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
            formLabelName="Responsibilities"
            value={value}
            placeholder="Type something..."
            handleInputChange={onChange}
            formErrorMessage={errors[name]?.message}
          />
        )}
      />
      <Controller
        name="requirements"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormTextarea
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
            formLabelName="Requirements & skills"
            value={value}
            placeholder="Type something..."
            handleInputChange={onChange}
            formErrorMessage={errors[name]?.message}
          />
        )}
      />
    </SharedModal>
  );
};

export default memo(CreateEditJobModal);
