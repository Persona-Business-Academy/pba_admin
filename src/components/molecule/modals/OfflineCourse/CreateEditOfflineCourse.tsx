import { FC, memo, useCallback } from "react";
import { HStack } from "@chakra-ui/react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { CustomSelect, FormInput } from "@/components/atom";
import { validateAgeLimit } from "@/utils/helpers/common";
import { CurrencyType, LanguageType, Maybe } from "@/utils/models/common";
import { SkillLevelType } from "@/utils/models/common";
import { OfflineCourse } from "@/utils/models/offlineCourses";
import { CreateEditOfflineCourseValidation } from "@/utils/validation/offline-courses";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  offlineCourse: Maybe<OfflineCourse>;
};

const SKILL_LEVELS: Array<{ name: SkillLevelType; value: SkillLevelType }> = [
  { name: "ADVANCED", value: "ADVANCED" },
  { name: "BEGINNER", value: "BEGINNER" },
  { name: "INTERMEDIATE", value: "INTERMEDIATE" },
  { name: "MASTER", value: "MASTER" },
];

const LANGUAGES: Array<{ name: string; value: LanguageType }> = [
  { name: "Armenian", value: "ARM" },
  { name: "English", value: "EN" },
];

const CURRENCIES: Array<{ name: CurrencyType; value: CurrencyType }> = [
  { name: "AMD", value: "AMD" },
  { name: "USD", value: "USD" },
];

const resolver = classValidatorResolver(CreateEditOfflineCourseValidation);

const CreateEditOfflineCourseModal: FC<Props> = ({ offlineCourse, isOpen, onClose, onSave }) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<CreateEditOfflineCourseValidation>({
    defaultValues: {
      title: !!offlineCourse ? offlineCourse.title : "",
      subTitle: !!offlineCourse ? offlineCourse.subTitle : "",
      description: !!offlineCourse ? offlineCourse.description : "",
      language: !!offlineCourse ? offlineCourse.language : "ARM",
      ageLimit: !!offlineCourse ? offlineCourse.ageLimit : "",
      totalDuration: !!offlineCourse ? offlineCourse.totalDuration : 0,
      level: !!offlineCourse ? offlineCourse.level : "BEGINNER",
      graduatedStudentsCount: !!offlineCourse ? offlineCourse.graduatedStudentsCount : 0,
      price: !!offlineCourse ? offlineCourse.price : 0,
      currency: !!offlineCourse ? offlineCourse.currency : "AMD",
    },
    resolver,
  });

  const onSuccess = useCallback(() => {
    onSave();
    onClose();
  }, [onClose, onSave]);

  const { mutate, isLoading } = useMutation<
    number,
    { message: string },
    CreateEditOfflineCourseValidation
  >(
    !!offlineCourse
      ? data => OfflineCourseService.editOfflineCourse(offlineCourse.id, data)
      : OfflineCourseService.createOfflineCourse,
    { onSuccess },
  );

  const onSubmit: SubmitHandler<CreateEditOfflineCourseValidation> = useCallback(
    data => {
      if (!validateAgeLimit(data.ageLimit)) {
        return setError("ageLimit", { message: "Invalid age limit" });
      }
      mutate(data);
    },
    [mutate, setError],
  );

  return (
    <SharedModal
      size="2xl"
      isOpen={isOpen}
      title={`${!!offlineCourse ? "Edit" : "Create"} Offline Course`}
      action={handleSubmit(onSubmit)}
      actionButtonText={!!offlineCourse ? "Save" : "Create"}
      onClose={onClose}
      isLoading={isLoading}
      actionButtonDisabled={!isDirty}>
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
            type="text"
            formLabelName="Title"
            value={value}
            placeholder="React.js course"
            handleInputChange={onChange}
            formErrorMessage={errors[name]?.message}
          />
        )}
      />
      <Controller
        name="subTitle"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
            type="text"
            formLabelName="Subtitle"
            value={value}
            placeholder="Type something..."
            handleInputChange={onChange}
            formErrorMessage={errors[name]?.message}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
            type="text"
            formLabelName="Description"
            value={value}
            placeholder="Type something..."
            handleInputChange={onChange}
            formErrorMessage={errors[name]?.message}
          />
        )}
      />
      <Controller
        name="graduatedStudentsCount"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
            type="number"
            formLabelName="Graduated Students Count"
            value={value}
            placeholder="345"
            handleInputChange={e => onChange(+e.target.value)}
            formErrorMessage={errors[name]?.message}
            inputProps={{ min: 0 }}
          />
        )}
      />
      <HStack alignItems="flex-start">
        <Controller
          name="language"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <CustomSelect
              isRequired
              name={name}
              formLabelName="Language"
              options={LANGUAGES}
              defaultValue={value}
              isInvalid={!!errors[name]?.message}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="level"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <CustomSelect
              isRequired
              name={name}
              formLabelName="Level"
              options={SKILL_LEVELS}
              defaultValue={value}
              isInvalid={!!errors[name]?.message}
              onChange={onChange}
            />
          )}
        />
      </HStack>
      <HStack alignItems="flex-start">
        <Controller
          name="price"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors[name]?.message}
              name={name}
              type="number"
              formLabelName="Price"
              value={value}
              placeholder="400"
              handleInputChange={e => onChange(+e.target.value)}
              formErrorMessage={errors[name]?.message}
              inputProps={{ min: 0 }}
            />
          )}
        />
        <Controller
          name="currency"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <CustomSelect
              isRequired
              name={name}
              formLabelName="Currency"
              options={CURRENCIES}
              defaultValue={value}
              isInvalid={!!errors[name]?.message}
              onChange={onChange}
            />
          )}
        />
      </HStack>
      <HStack alignItems="flex-start">
        <Controller
          name="ageLimit"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors[name]?.message}
              name={name}
              type="text"
              formLabelName="Age limit"
              value={value}
              placeholder="10-17"
              handleInputChange={onChange}
              formErrorMessage={errors[name]?.message}
            />
          )}
        />
        <Controller
          name="totalDuration"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors[name]?.message}
              name={name}
              type="number"
              formLabelName="Total duration of month"
              value={value}
              placeholder="3"
              handleInputChange={e => onChange(+e.target.value)}
              formErrorMessage={errors[name]?.message}
              inputProps={{ min: 0 }}
            />
          )}
        />
      </HStack>
    </SharedModal>
  );
};

export default memo(CreateEditOfflineCourseModal);
