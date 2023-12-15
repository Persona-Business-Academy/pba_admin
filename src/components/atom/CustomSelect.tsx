import React, { memo } from "react";
import { FormControl, FormLabel, Select, SelectProps, Text } from "@chakra-ui/react";

interface CustomSelectProps extends SelectProps {
  isInvalid?: boolean;
  isRequired?: boolean;
  formLabelName?: string;
  options: Array<{ name: string; value: string | number }>;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  isInvalid,
  options,
  isRequired,
  formLabelName,
  name,
  ...rest
}) => {
  return (
    <FormControl isInvalid={isInvalid} id={name} marginBottom="15px">
      <FormLabel fontWeight={600} marginBottom={4} lineHeight="20px" fontSize={14} color="#222">
        {formLabelName}
        {isRequired && (
          <Text as="span" color="#222">
            *
          </Text>
        )}
      </FormLabel>
      <Select {...rest}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default memo(CustomSelect);
