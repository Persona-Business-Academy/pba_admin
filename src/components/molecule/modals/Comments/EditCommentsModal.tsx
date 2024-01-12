import { FC, memo, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CommentService } from "@/api/services/CommentService";
import { FormInput, FormTextarea } from "@/components/atom";
import { CommentFormData, CommentModel } from "@/utils/models/comments";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  comment: CommentModel;
};

const EditCommentsModal: FC<Props> = ({ isOpen, comment, onClose, onSave }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CommentFormData>({
    defaultValues: { headline: comment.headline, text: comment.text },
  });

  const { mutate, isLoading } = useMutation<CommentModel, { message: string }, CommentFormData>(
    data => CommentService.edit(comment.id, data),
    { onSuccess: () => onSave() },
  );

  const onEdit: SubmitHandler<CommentFormData> = useCallback(
    ({ headline, text }) => {
      mutate({ headline, text });
      onClose();
    },
    [mutate, onClose],
  );

  return (
    <SharedModal
      size="2xl"
      isOpen={isOpen}
      title={"Edit Comment"}
      action={handleSubmit(onEdit)}
      actionButtonText={"Save"}
      onClose={onClose}
      isLoading={isLoading}
      actionButtonDisabled={!isDirty}>
      <Controller
        name="headline"
        control={control}
        rules={{ required: "Headline is required" }}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            isInvalid={!!errors[name]?.message}
            name={name}
            type="text"
            value={value}
            placeholder="Headline"
            handleInputChange={onChange}
            formErrorMessage={errors[name]?.message}
          />
        )}
      />
      <Controller
        name="text"
        control={control}
        rules={{ required: "Comment is required" }}
        render={({ field: { onChange, value, name } }) => (
          <FormTextarea
            isInvalid={!!errors[name]?.message}
            name={name}
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

export default memo(EditCommentsModal);
