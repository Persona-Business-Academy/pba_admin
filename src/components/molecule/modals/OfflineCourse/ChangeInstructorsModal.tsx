import { FC, memo, useCallback } from "react";
import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { ListIcon, ListItem } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { InstructorService } from "@/api/services/InstructorsService";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { OfflineCourse } from "@/models/offlineCourses";
import { AddOfflineInstructorsValidation } from "@/validation/offline-courses";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  offlineCourse: NonNullable<OfflineCourse>;
};

const ChangeInstructorsModal: FC<Props> = ({ offlineCourse, isOpen, onClose, onSave }) => {
  const { data } = useQuery({
    queryKey: ["all-instructors"],
    queryFn: () =>
      InstructorService.getAllInstructors({ offset: 0, limit: 100000, sorting: [], search: "" }),
    keepPreviousData: true,
  });

  const instructorExist = useCallback(
    (id: number) => offlineCourse?.OfflineCourseInstructors.find(item => item.instructor.id === id),
    [offlineCourse?.OfflineCourseInstructors],
  );

  const { mutate: add, isLoading: addLoading } = useMutation<
    number,
    { message: string },
    AddOfflineInstructorsValidation
  >(OfflineCourseService.addInstructor, { onSuccess: onSave });

  const { mutate: remove, isLoading: removeLoading } = useMutation<
    number,
    { message: string },
    { id: number }
  >(OfflineCourseService.removeInstructor, { onSuccess: onSave });

  return (
    <SharedModal
      size="2xl"
      isOpen={isOpen}
      title="Instructors"
      onClose={onClose}
      isLoading={addLoading || removeLoading}>
      {data?.instructors.map(({ id, firstName, lastName }) => (
        <ListItem
          key={id}
          fontWeight="bold"
          borderRadius={6}
          padding={2}
          transition={"all 0.3s"}
          _hover={{ background: "gray.100" }}>
          {!!instructorExist(id) ? (
            <ListIcon
              as={DeleteIcon}
              color="red.500"
              cursor={"pointer"}
              onClick={() => {
                const _id = instructorExist(id)?.id;
                if (_id) remove({ id: _id });
              }}
            />
          ) : (
            <ListIcon
              as={PlusSquareIcon}
              color="green.500"
              cursor={"pointer"}
              onClick={() => add({ offlineCourseId: offlineCourse.id, instructorId: id })}
            />
          )}
          {firstName + " " + lastName}
        </ListItem>
      ))}
    </SharedModal>
  );
};

export default memo(ChangeInstructorsModal);
