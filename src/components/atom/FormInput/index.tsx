import React, { ChangeEvent, FC, memo, useCallback, useMemo, useState } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

type Props = {
  isInvalid?: boolean;
  formLabelName?: string;
  value?: string | number;
  handleInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  formHelperText?: string;
  formErrorMessage?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  name: string;
  inputProps?: InputProps;
  InputRight?: React.ReactNode;
};

const FormInput: FC<Props> = ({
  isInvalid,
  value,
  handleInputChange,
  formHelperText,
  formErrorMessage,
  type,
  formLabelName,
  placeholder,
  isRequired,
  isReadOnly,
  name,
  inputProps,
  InputRight,
}) => {
  const [isPasswordType, setIsPasswordType] = useState(false);

  const EyeIcon = useMemo(() => (isPasswordType ? <FaEye /> : <FaEyeSlash />), [isPasswordType]);
  const setPassType = useCallback(() => setIsPasswordType(prev => !prev), []);

  return (
    <FormControl isInvalid={isInvalid} id={name}>
      <FormLabel fontWeight={600} marginBottom={4} lineHeight="20px" fontSize={14} color="#222">
        {formLabelName}
        {isRequired && (
          <Text as="span" color="#222">
            *
          </Text>
        )}
      </FormLabel>
      <InputGroup>
        <Input
          type={!isPasswordType ? type : "text"}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          isReadOnly={isReadOnly}
          isRequired={isRequired}
          borderRadius={6}
          height="40px"
          boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.05)"
          _focus={{
            border: "1px solid #3cb4e7",
          }}
          _focusVisible={{
            border: "1px solid #3cb4e7",
          }}
          _readOnly={{
            bg: "violet.50",
            color: "violet.200",
            border: "1px solid grey.100",
          }}
          _placeholder={{
            color: "grey.100",
            fontSize: 16,
            fontWeight: 400,
            fontStyle: "normal",
          }}
          _invalid={{
            border: "1px solid #DF1414",
          }}
          {...inputProps}
        />
        {type === "password" ? (
          <InputRightElement>
            <IconButton
              background="transparent"
              aria-label="eye"
              icon={EyeIcon}
              isDisabled={!value}
              onClick={setPassType}
            />
          </InputRightElement>
        ) : null}
        {InputRight && <InputRightElement>{InputRight}</InputRightElement>}
      </InputGroup>
      {!isInvalid ? (
        <FormHelperText fontWeight={400} color="#5b5b5b" marginTop={4}>
          {formHelperText}
        </FormHelperText>
      ) : (
        <FormErrorMessage color="#DF1414" fontWeight={400} marginTop={4}>
          {formErrorMessage}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default memo(FormInput);
