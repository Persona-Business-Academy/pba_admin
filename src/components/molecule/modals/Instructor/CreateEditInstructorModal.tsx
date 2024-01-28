import { FC, memo, useCallback, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Center, Fade, HStack, IconButton, Text, useToast } from "@chakra-ui/react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { InstructorService } from "@/api/services/InstructorsService";
import { FormInput, FormTextarea, UploadFile } from "@/components/atom";
import { colors } from "@/utils/constants/chakra";
import { generateAWSUrl } from "@/utils/helpers/common";
import { generateInstructorDefaultValues } from "@/utils/helpers/formData";
import { generateFileNames, uploadDocumentToAWS } from "@/utils/helpers/uploadFile";
import { Maybe } from "@/utils/models/common";
import { InstructorType } from "@/utils/models/instructors";
import { CreateEditInstructorValidation } from "@/utils/validation/instructors";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  instructor: Maybe<InstructorType>;
};

const resolver = classValidatorResolver(CreateEditInstructorValidation);

const CreateEditInstructorModal: FC<Props> = ({ instructor, isOpen, onClose, onSave }) => {
  const [localImage, setLocalImage] = useState<{ file: File; localUrl: string } | null>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateEditInstructorValidation>({
    defaultValues: generateInstructorDefaultValues(instructor),
    resolver,
  });

  const onSuccess = useCallback(() => {
    onSave();
    onClose();
  }, [onClose, onSave]);

  const { mutate, isLoading } = useMutation<
    InstructorType,
    { message: string },
    CreateEditInstructorValidation
  >(
    !!instructor
      ? data => InstructorService.editInstructor(instructor.id, data)
      : InstructorService.createInstructor,
    { onSuccess, onError: () => setFileLoading(false) },
  );

  const onFileSelect = useCallback((files: Maybe<FileList>) => {
    if (files?.length) {
      setLocalImage({ file: files[0], localUrl: URL.createObjectURL(files[0]) });
    }
  }, []);

  const removeCoverPhoto = useCallback(() => setLocalImage(null), []);

  const onSubmit: SubmitHandler<CreateEditInstructorValidation> = useCallback(
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
            fileName: generateFileNames(data.mediaId, "InstructorAvatar"),
          });
          mutate({ ...data, avatar: res.key });
        } else {
          mutate(data);
        }
      } catch (e) {
        setFileLoading(false);
      }
    },
    [localImage?.file, mutate, toast],
  );

  return (
    <SharedModal
      size="2xl"
      isOpen={isOpen}
      title={`${!!instructor ? "Edit" : "Create"} Instructor`}
      action={handleSubmit(onSubmit)}
      actionButtonText={!!instructor ? "Save" : "Create"}
      onClose={onClose}
      isLoading={isLoading || fileLoading}
      actionButtonDisabled={!isDirty && !localImage}>
      <Controller
        name="avatar"
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
                      <Text color="blue.500">No avatar</Text>
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
      <HStack>
        <Controller
          name="firstName"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors[name]?.message}
              name="name"
              type="text"
              formLabelName="First Name"
              value={value}
              placeholder="John"
              handleInputChange={onChange}
              formErrorMessage={errors[name]?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors[name]?.message}
              name={name}
              type="text"
              formLabelName="Last Name"
              value={value}
              placeholder="Doe"
              handleInputChange={onChange}
              formErrorMessage={errors[name]?.message}
            />
          )}
        />
      </HStack>
      <Controller
        name="profession"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
            type="text"
            formLabelName="Profession"
            value={value}
            placeholder="Type something..."
            handleInputChange={onChange}
            formErrorMessage={errors[name]?.message}
          />
        )}
      />
      <Controller
        name="about"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormTextarea
            isRequired
            isInvalid={!!errors[name]?.message}
            name={name}
            formLabelName="About"
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

export default memo(CreateEditInstructorModal);
