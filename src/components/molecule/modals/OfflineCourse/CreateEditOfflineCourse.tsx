import { FC, memo, useCallback, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Center,
  Fade,
  FormLabel,
  HStack,
  IconButton,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { CustomSelect, FormInput, FormTextarea, UploadFile } from "@/components/atom";
import { colors } from "@/utils/constants/chakra";
import { CURRENCIES, LANGUAGES, SKILL_LEVELS, TOPICS } from "@/utils/constants/courses";
import { generateAWSUrl, validateAgeLimit } from "@/utils/helpers/common";
import { generateOfflineCourseDefaultValues } from "@/utils/helpers/formData";
import { generateFileNames, uploadDocumentToAWS } from "@/utils/helpers/uploadFile";
import { Maybe } from "@/utils/models/common";
import { OfflineCourse } from "@/utils/models/offlineCourses";
import { CreateOfflineCourseValidation } from "@/utils/validation/offline-courses";
import WhatYouWillLearn from "../../WhatYouWillLearn";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  forKids: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  offlineCourse: Maybe<OfflineCourse>;
};

const resolver = classValidatorResolver(CreateOfflineCourseValidation);

const CreateEditOfflineCourseModal: FC<Props> = ({
  forKids,
  offlineCourse,
  isOpen,
  onClose,
  onSave,
}) => {
  const [localImage, setLocalImage] = useState<Maybe<{ file: File; localUrl: string }>>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<CreateOfflineCourseValidation>({
    defaultValues: generateOfflineCourseDefaultValues(offlineCourse, forKids),
    resolver,
  });
  const { append, remove } = useFieldArray({ control, name: "whatYouWillLearn" });

  const onSuccess = useCallback(() => {
    onSave();
    onClose();
  }, [onClose, onSave]);

  const { mutate, isLoading } = useMutation<
    number,
    { message: string },
    CreateOfflineCourseValidation
  >(
    !!offlineCourse
      ? data => OfflineCourseService.editOfflineCourse(offlineCourse.id, data)
      : OfflineCourseService.createOfflineCourse,
    { onSuccess, onError: () => setFileLoading(false) },
  );

  const onFileSelect = useCallback((files: Maybe<FileList>) => {
    if (files?.length) {
      setLocalImage({ file: files[0], localUrl: URL.createObjectURL(files[0]) });
    }
  }, []);

  const removeCoverPhoto = useCallback(() => setLocalImage(null), []);

  const onSubmit: SubmitHandler<CreateOfflineCourseValidation> = useCallback(
    async data => {
      try {
        if (!validateAgeLimit(data.ageLimit)) {
          return setError("ageLimit", { message: "Invalid age limit" });
        }
        const entryOrderNum = SKILL_LEVELS.find(el => el.value === data.entryLevel)?.order;
        const levelOrderNum = SKILL_LEVELS.find(el => el.value === data.courseLevel)?.order;
        if (!entryOrderNum || !levelOrderNum || levelOrderNum < entryOrderNum) {
          setError("entryLevel", { message: "Invalid data" });
          setError("courseLevel", { message: "Invalid data" });
          return;
        }

        let reqData = data;
        if (localImage?.file) {
          if (localImage.file.size > 3 * 1024 * 1024) {
            return toast({
              title: "File size too large. Maximum size allowed is 3mb",
              status: "warning",
            });
          }
          setFileLoading(true);
          const res = await uploadDocumentToAWS({
            file: localImage.file,
            fileName: generateFileNames(data.mediaId, "OfflineCourseCoverPhoto"),
          });

          reqData.coverPhoto = res.key;
        }

        mutate(reqData);
      } catch (e) {
        setFileLoading(false);
      }
    },
    [localImage?.file, mutate, setError, toast],
  );

  return (
    <SharedModal
      size="4xl"
      isOpen={isOpen}
      title={`${!!offlineCourse ? "Edit" : "Create"} Offline Course`}
      action={handleSubmit(onSubmit)}
      actionButtonText={!!offlineCourse ? "Save" : "Create"}
      onClose={onClose}
      isLoading={isLoading || fileLoading}
      actionButtonDisabled={!isDirty && !localImage}>
      <Controller
        name="coverPhoto"
        control={control}
        render={({ field: { value } }) => (
          <HStack>
            <UploadFile
              content={
                localImage?.localUrl || value ? (
                  <Fade in>
                    <Image
                      priority
                      src={localImage?.localUrl || generateAWSUrl(value)}
                      width={150}
                      height={150}
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: 6,
                        backgroundColor: "gray.200",
                        objectFit: "cover",
                      }}
                      alt="Avatar"
                    />
                  </Fade>
                ) : (
                  <Fade in>
                    <Center
                      boxSize={"150px"}
                      borderRadius={6}
                      border={`2px solid ${colors.blue[500]}`}>
                      <Text color="blue.500">No photo</Text>
                    </Center>
                  </Fade>
                )
              }
              changeHandler={onFileSelect}
              accept="image/*"
            />
            <Fade in={!!localImage?.localUrl}>
              <IconButton
                aria-label="remove local photo"
                icon={<DeleteIcon />}
                onClick={removeCoverPhoto}
              />
            </Fade>
          </HStack>
        )}
      />
      <HStack alignItems="flex-start" spacing={10}>
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
          name="disabled"
          rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <>
              <FormLabel htmlFor="isChecked" m={0}>
                Disabled
              </FormLabel>
              <Switch id="isChecked" name={name} isChecked={value} onChange={onChange} />
            </>
          )}
        />
      </HStack>
      <Controller
        name="subTitle"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormTextarea
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
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
        name="topic"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <CustomSelect
            isRequired
            name={name}
            formLabelName="Topic"
            options={TOPICS}
            defaultValue={value}
            isInvalid={!!errors[name]?.message}
            onChange={onChange}
          />
        )}
      />
      <HStack alignItems="flex-start">
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
              value={value || ""}
              placeholder="345"
              handleInputChange={e => onChange(+e.target.value)}
              formErrorMessage={errors[name]?.message}
              inputProps={{ min: 0 }}
            />
          )}
        />
        <Controller
          name="enrolledStudentsCount"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors[name]?.message}
              name={name}
              type="number"
              formLabelName="Enrolled students count"
              value={value || ""}
              placeholder="345"
              handleInputChange={e => onChange(+e.target.value)}
              formErrorMessage={errors[name]?.message}
              inputProps={{ min: 0 }}
            />
          )}
        />
      </HStack>
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
          name="entryLevel"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <CustomSelect
              isRequired
              name={name}
              formLabelName="Entry level"
              options={SKILL_LEVELS}
              defaultValue={value}
              isInvalid={!!errors[name]?.message}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="courseLevel"
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
              value={value || ""}
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
              value={value || ""}
              placeholder="3"
              handleInputChange={e => onChange(+e.target.value)}
              formErrorMessage={errors[name]?.message}
              inputProps={{ min: 0 }}
            />
          )}
        />
        <Controller
          name="lessonsCount"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors[name]?.message}
              name={name}
              type="number"
              formLabelName="Lessons count"
              value={value || ""}
              placeholder="3"
              handleInputChange={e => onChange(+e.target.value)}
              formErrorMessage={errors[name]?.message}
              inputProps={{ min: 0 }}
            />
          )}
        />
      </HStack>
      <Controller
        name="whatYouWillLearn"
        control={control}
        render={({ field: { value } }) => (
          <WhatYouWillLearn data={value} add={append} remove={remove} />
        )}
      />
    </SharedModal>
  );
};

export default memo(CreateEditOfflineCourseModal);
