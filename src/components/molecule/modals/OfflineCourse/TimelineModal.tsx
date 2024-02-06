import React, { FC, memo, useCallback, useEffect, useMemo } from "react";
import { Button, Flex, HStack, IconButton, List, ListItem, Text, VStack } from "@chakra-ui/react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { BsPlusCircle } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { FormInput } from "@/components/atom";
import { QUERY_KEY } from "@/utils/helpers/queryClient";
import { Timeline } from "@/utils/models/offlineCourses";
import { AddEditOfflineCourseTimelineValidation } from "@/utils/validation/offline-courses";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

interface Props {
  offlineCourseId: number;
  onClose: () => void;
}
interface FormData extends AddEditOfflineCourseTimelineValidation {
  startDate: string;
}

const resolver = classValidatorResolver(AddEditOfflineCourseTimelineValidation);

const TimelineModal: FC<Props> = ({ offlineCourseId, onClose }) => {
  const { data: offlineCourse } = useQuery({
    queryKey: QUERY_KEY.offlineCourse(offlineCourseId),
    queryFn: () => OfflineCourseService.getOfflineCourse(offlineCourseId),
    enabled: !!offlineCourseId,
  });
  const timelineId = offlineCourse?.TimeLine?.id;

  const defaultValues = useMemo(
    () => ({
      startDate: "",
      offlineCourseId: offlineCourse?.id,
      startDates: offlineCourse?.TimeLine?.startDates.map(value => ({ id: uuidv4(), value })) || [],
    }),
    [offlineCourse?.id, offlineCourse?.TimeLine?.startDates],
  );

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ defaultValues, resolver });

  const { append, remove, fields } = useFieldArray({ control, name: "startDates" });

  const isDirty = useMemo(
    () => JSON.stringify(fields) !== JSON.stringify(defaultValues.startDates),
    [defaultValues.startDates, fields],
  );

  const { mutate, isLoading } = useMutation<
    Timeline,
    { message: string },
    AddEditOfflineCourseTimelineValidation
  >(
    timelineId
      ? data => OfflineCourseService.editTimeline(timelineId, data)
      : OfflineCourseService.addTimeline,
    {
      onSuccess: onClose,
    },
  );

  const addNewValue = useCallback(() => {
    append({ id: uuidv4(), value: new Date(watch("startDate")) });
    setValue("startDate", defaultValues.startDate);
  }, [append, defaultValues.startDate, setValue, watch]);

  const onSubmit: SubmitHandler<FormData> = useCallback(
    ({ startDates }) => {
      if (offlineCourse) {
        mutate({ startDates, offlineCourseId: offlineCourse.id });
      }
    },
    [mutate, offlineCourse],
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <SharedModal
      isOpen
      size="2xl"
      title="Add Timeline"
      actionButtonText="Save"
      isLoading={isLoading}
      actionButtonDisabled={!isDirty}
      action={handleSubmit(onSubmit)}
      onClose={onClose}>
      <VStack>
        <Controller
          name="startDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <HStack w="100%" alignItems="center">
              <FormInput
                isRequired
                isInvalid={!!errors.startDate?.message}
                name="startDate"
                type="datetime-local"
                formLabelName="Start date"
                value={value}
                handleInputChange={onChange}
                formErrorMessage={errors.startDate?.message}
              />
              <IconButton
                mt={5}
                aria-label="add"
                background="blue.300"
                _hover={{ background: "blue.300" }}
                icon={<BsPlusCircle />}
                onClick={addNewValue}
                isDisabled={!value}
              />
            </HStack>
          )}
        />
        <List mt={4} w="100%">
          {fields.map(({ id, value }, idx) => (
            <ListItem key={id} mb={2}>
              <Flex justify="space-between" align="center">
                <Text>{dayjs(value).format("dddd, MMMM D, YYYY h:mm A")}</Text>
                <Button size="sm" colorScheme="red" onClick={() => remove(idx)}>
                  Remove
                </Button>
              </Flex>
            </ListItem>
          ))}
        </List>
      </VStack>
    </SharedModal>
  );
};

export default memo(TimelineModal);
