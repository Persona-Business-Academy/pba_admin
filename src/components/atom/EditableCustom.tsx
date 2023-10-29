import React, { FC, memo } from "react";
import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  CloseButton,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  IconButton,
  useEditableControls,
} from "@chakra-ui/react";

const EditableControls = () => {
  const { isEditing, getEditButtonProps, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls();
  return (
    <HStack spacing={"5px"}>
      {isEditing ? (
        <>
          <IconButton aria-label="Save" icon={<CheckIcon />} {...getSubmitButtonProps()} />
          <CloseButton {...getCancelButtonProps()} />
        </>
      ) : (
        <IconButton aria-label="Edit" icon={<EditIcon />} {...getEditButtonProps()} />
      )}
    </HStack>
  );
};

type Props = {
  value: string;
  onChange: () => void;
  onCancel: (prevValue: string) => void;
  onSubmit: () => void;
};

const EditableCustom: FC<Props> = ({ value, onChange, onCancel, onSubmit }) => (
  <Editable
    value={value}
    isPreviewFocusable={false}
    selectAllOnFocus={false}
    submitOnBlur={false}
    onCancel={onCancel}
    onSubmit={onSubmit}>
    <HStack spacing={"5px"} alignItems={"center"}>
      <Box>
        <EditablePreview fontSize={30} fontWeight={"bold"} />
        <EditableInput
          fontSize={30}
          fontWeight={"bold"}
          paddingX="10px"
          borderRadius="40px"
          onChange={onChange}
        />
      </Box>
      <EditableControls />
    </HStack>
  </Editable>
);

export default memo(EditableCustom);
