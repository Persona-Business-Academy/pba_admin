import { FC, memo, useCallback, useEffect } from "react";
import { Button, Flex, HStack, IconButton, List, ListItem, Text, VStack } from "@chakra-ui/react";
import { Controller, FieldArrayMethodProps, SubmitHandler, useForm } from "react-hook-form";
import { BsPlusCircle } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { WhatYouWillLearnType } from "@/utils/models/common";
import { FormTextarea } from "../atom";

type Props = {
  data: WhatYouWillLearnType[];
  add: (
    value: WhatYouWillLearnType | WhatYouWillLearnType[],
    options?: FieldArrayMethodProps | undefined,
  ) => void;
  remove: (index?: number | number[] | undefined) => void;
};

const WhatYouWillLearn: FC<Props> = ({ data, add, remove }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<{ value: string }>({ defaultValues: { value: "" } });

  const addNewValue: SubmitHandler<{ value: string }> = useCallback(
    values => {
      add({ id: uuidv4(), value: values.value });
      reset();
    },
    [add, reset],
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit(addNewValue)();
      }
    },
    [addNewValue, handleSubmit],
  );

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <VStack>
      <Controller
        name="value"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <HStack w="100%" alignItems="flex-start">
            <FormTextarea
              name="newWhatYouWillLearnValue"
              formLabelName="What you will learn"
              placeholder="Add a new value"
              value={value}
              handleInputChange={onChange}
            />
            <IconButton
              mt={9}
              aria-label="add"
              background="blue.300"
              _hover={{ background: "blue.300" }}
              icon={<BsPlusCircle />}
              isDisabled={!isValid}
              onClick={handleSubmit(addNewValue)}
            />
          </HStack>
        )}
      />
      <List mt={4} w="100%">
        {data.map(({ id, value }, idx) => (
          <ListItem key={id} mb={2}>
            <Flex justify="space-between" align="center">
              <Text>{value}</Text>
              <Button size="sm" colorScheme="red" onClick={() => remove(idx)}>
                Remove
              </Button>
            </Flex>
          </ListItem>
        ))}
      </List>
    </VStack>
  );
};

export default memo(WhatYouWillLearn);
