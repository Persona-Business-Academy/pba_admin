import { FC, memo, useCallback, useMemo } from "react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { InstructorService } from "@/api/services/InstructorsService";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { FormInput } from "@/components/atom";
import CustomSelect from "@/components/atom/CustomSelect";
import { CurrencyType, LanguageType, Maybe } from "@/models/common";
import { SkillLevelType } from "@/models/common";
import { OfflineCourse } from "@/models/offlineCourses";
import { CreateEditOfflineCourseValidation } from "@/validation/offline-courses";

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
  const { data } = useQuery({
    queryKey: ["all-instructors"],
    queryFn: () =>
      InstructorService.getAllInstructors({ offset: 0, limit: 100000, sorting: [], search: "" }),
    keepPreviousData: true,
  });

  const _instructors = useMemo(
    () =>
      data?.instructors.map(({ id, firstName, lastName }) => ({
        name: `${firstName} ${lastName}`,
        value: id,
      })) || [],
    [data?.instructors],
  );

  const {
    control,
    handleSubmit,
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
    data => mutate(data),
    [mutate],
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
            name="title"
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
        name="level"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <CustomSelect
            isRequired
            name={name}
            formLabelName="Course Level"
            options={SKILL_LEVELS}
            defaultValue={value}
            isInvalid={!!errors[name]?.message}
            onChange={onChange}
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
      <Controller
        name="subTitle"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
            type="text"
            formLabelName="Sub title"
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

export default memo(CreateEditOfflineCourseModal);
