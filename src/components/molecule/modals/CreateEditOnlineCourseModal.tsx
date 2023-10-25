import { FC, memo, useCallback } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import { Maybe } from "@/models/common";
import { OnlineCourse } from "@/models/onlineCourses";
import { CreateEditOnlineCourseValidation } from "@/validation/online-courses";
import { FormInput } from "../../atom";

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
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${!!onlineCourse ? "Edit" : "Create"} Online Course`}</ModalHeader>
        <ModalBody>
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
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={isLoading} mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit(useCallback(data => mutate(data), [mutate]))}
            isDisabled={!isDirty}
            isLoading={isLoading}>
            {!!onlineCourse ? "Save" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(CreateEditOnlineCourseModal);
