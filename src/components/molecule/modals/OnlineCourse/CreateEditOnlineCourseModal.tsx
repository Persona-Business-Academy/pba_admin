import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Center, Fade, HStack, IconButton, Image, Link, Text, useToast } from "@chakra-ui/react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { InstructorService } from "@/api/services/InstructorsService";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { FormInput } from "@/components/atom";
import CustomSelect from "@/components/atom/CustomSelect";
import UploadFile from "@/components/atom/UploadFile";
import { colors } from "@/utils/constants/chakra";
import { INSTRUCTORS } from "@/utils/constants/routes";
import { generateAWSUrl } from "@/utils/helpers/common";
import {
  generateOnlineCourseCoverPhotoName,
  uploadDocumentToAWS,
} from "@/utils/helpers/uploadFile";
import { LanguageType, Maybe, SkillLevelType } from "@/utils/models/common";
import { OnlineCourse } from "@/utils/models/onlineCourses";
import { CreateEditOnlineCourseValidation } from "@/utils/validation/online-courses";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onlineCourse: Maybe<OnlineCourse>;
};

const SKILL_LEVELS: Array<{ name: SkillLevelType; value: SkillLevelType }> = [
  { name: "ADVANCED", value: "ADVANCED" },
  { name: "BEGINNER", value: "BEGINNER" },
  { name: "INTERMEDIATE", value: "INTERMEDIATE" },
  { name: "MASTER", value: "MASTER" },
];

const TOPICS = [
  { name: "MARKETING", value: "MARKETING" },
  { name: "DESIGN", value: "DESIGN" },
  { name: "DEVELOPMENT", value: "DEVELOPMENT" },
];

const LANGUAGES: Array<{ name: string; value: LanguageType }> = [
  { name: "Armenian", value: "ARM" },
  { name: "English", value: "EN" },
];

const resolver = classValidatorResolver(CreateEditOnlineCourseValidation);

const CreateEditOnlineCourseModal: FC<Props> = ({ onlineCourse, isOpen, onClose, onSave }) => {
  const [localImage, setLocalImage] = useState<{ file: File; localUrl: string } | null>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);

  const toast = useToast();

  const { data } = useQuery({
    queryKey: ["all-instructors"],
    queryFn: () =>
      InstructorService.getAllInstructors({ offset: 0, limit: 100000, sorting: [], search: "" }),
    keepPreviousData: true,
  });

  const instructors = useMemo(
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
    setValue,
    formState: { errors, isDirty },
  } = useForm<CreateEditOnlineCourseValidation>({
    defaultValues: {
      name: !!onlineCourse ? onlineCourse.name : "",
      description: !!onlineCourse ? onlineCourse.description : "",
      courseLevel: !!onlineCourse ? onlineCourse.courseLevel : "BEGINNER",
      topic: !!onlineCourse ? onlineCourse.topic : "MARKETING",
      language: !!onlineCourse ? onlineCourse.language : "ARM",
      instructorId: !!onlineCourse ? onlineCourse.instructorId : undefined,
      coverPhoto: !!onlineCourse ? onlineCourse.coverPhoto : "",
      coverPhotoId: !!onlineCourse ? onlineCourse.coverPhotoId : uuidv4(),
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
    CreateEditOnlineCourseValidation
  >(
    !!onlineCourse
      ? data => OnlineCourseService.editOnlineCourse(onlineCourse.id, data)
      : OnlineCourseService.createOnlineCourse,
    { onSuccess, onError: () => setFileLoading(false) },
  );

  const onFileSelect = useCallback((files: Maybe<FileList>) => {
    if (files?.length) {
      setLocalImage({ file: files[0], localUrl: URL.createObjectURL(files[0]) });
    }
  }, []);

  const removeCoverPhoto = useCallback(() => setLocalImage(null), []);

  const onSubmit: SubmitHandler<CreateEditOnlineCourseValidation> = useCallback(
    async data => {
      try {
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
            fileName: generateOnlineCourseCoverPhotoName(data.coverPhotoId),
          });
          mutate({ ...data, coverPhoto: res.key });
        } else {
          mutate(data);
        }
      } catch (e) {
        setFileLoading(false);
      }
    },
    [localImage?.file, mutate, toast],
  );

  useEffect(() => {
    if (data?.count && data.instructors) {
      setValue("instructorId", data.instructors[0].id);
    }
  }, [data?.count, data?.instructors, setValue]);

  return (
    <SharedModal
      size="2xl"
      isOpen={isOpen}
      title={`${!!onlineCourse ? "Edit" : "Create"} Online Course`}
      action={handleSubmit(onSubmit)}
      actionButtonText={!!onlineCourse ? "Save" : "Create"}
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
                      src={localImage?.localUrl || generateAWSUrl(value)}
                      width={150}
                      height={150}
                      borderRadius={6}
                      objectFit={"cover"}
                      backgroundColor={"gray.200"}
                      alt="Cover photo"
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
            {!data?.count && (
              <Link as={NextLink} href={INSTRUCTORS} marginLeft={5} color={colors.blue[500]}>
                {`Go to create Instructor >`}
              </Link>
            )}
          </HStack>
        )}
      />
      <HStack>
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors[name]?.message}
              name="name"
              type="text"
              formLabelName="Name"
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
      </HStack>
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
        name="courseLevel"
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
        name="topic"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <CustomSelect
            isRequired
            name={name}
            formLabelName="Topic"
            options={TOPICS}
            value={value}
            isInvalid={!!errors[name]?.message}
            onChange={onChange}
          />
        )}
      />
      {!!data?.count && (
        <Controller
          name="instructorId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <CustomSelect
              isRequired
              name={name}
              formLabelName="Instructors"
              options={instructors}
              value={value}
              isInvalid={!!errors[name]?.message}
              onChange={onChange}
            />
          )}
        />
      )}
    </SharedModal>
  );
};

export default memo(CreateEditOnlineCourseModal);
