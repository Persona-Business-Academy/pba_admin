import { FC, memo, useCallback } from "react";
import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  HStack,
  Link,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { InstructorService } from "@/api/services/InstructorsService";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { INSTRUCTORS } from "@/utils/constants/routes";
import { generateAWSUrl } from "@/utils/helpers/common";
import { AddOfflineInstructorsValidation } from "@/utils/validation/offline-courses";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  offlineCourseId: number;
};

const ChangeInstructorsModal: FC<Props> = ({ offlineCourseId, isOpen, onClose }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["all-instructors"],
    queryFn: () =>
      InstructorService.getAllInstructors({ offset: 0, limit: 100000, sorting: [], search: "" }),
    keepPreviousData: true,
  });

  const { data: offlineCourse, refetch } = useQuery({
    queryKey: ["offline-course", offlineCourseId],
    queryFn: () => OfflineCourseService.getOfflineCourse(offlineCourseId),
  });

  const instructorExist = useCallback(
    (id: number) => offlineCourse?.OfflineCourseInstructors.find(item => item.instructor.id === id),
    [offlineCourse?.OfflineCourseInstructors],
  );

  const { mutate: add, isLoading: addLoading } = useMutation<
    number,
    { message: string },
    AddOfflineInstructorsValidation
  >(OfflineCourseService.addInstructor, { onSuccess: () => refetch() });

  const { mutate: remove, isLoading: removeLoading } = useMutation<
    number,
    { message: string },
    { id: number }
  >(OfflineCourseService.removeInstructor, { onSuccess: () => refetch() });

  const mutate = useCallback(
    (type: "add" | "remove", id: number) => {
      if (addLoading || removeLoading) {
        return;
      }

      switch (type) {
        case "add": {
          return add({ offlineCourseId, instructorId: id });
        }
        case "remove": {
          const _id = instructorExist(id)?.id;
          if (_id) {
            return remove({ id: _id });
          }
          return;
        }
        default:
          return;
      }
    },
    [add, addLoading, instructorExist, offlineCourseId, remove, removeLoading],
  );

  return (
    <SharedModal
      size="2xl"
      isOpen={isOpen}
      title="Instructors"
      onClose={onClose}
      isLoading={addLoading || removeLoading}>
      <Box minH={300} w={"100%"}>
        {!data?.instructors.length ? (
          isLoading ? (
            <Spinner />
          ) : (
            <Text>
              No data yet{" "}
              <Link as={NextLink} href={INSTRUCTORS} color={"blue.500"}>
                {`Add instructors >`}
              </Link>
            </Text>
          )
        ) : (
          <List spacing={3}>
            {data?.instructors.map(({ id, firstName, lastName, avatar }) => (
              <ListItem
                key={id}
                fontWeight="bold"
                borderRadius={6}
                padding={2}
                transition={"all 0.3s"}
                _hover={{ background: "gray.100" }}>
                <HStack>
                  {!!instructorExist(id) ? (
                    <ListIcon
                      as={DeleteIcon}
                      color="red.500"
                      cursor={"pointer"}
                      onClick={() => mutate("remove", id)}
                    />
                  ) : (
                    <ListIcon
                      as={PlusSquareIcon}
                      color="green.500"
                      cursor={"pointer"}
                      onClick={() => mutate("add", id)}
                    />
                  )}
                  <Avatar
                    bgColor="blue.100"
                    name={firstName + " " + lastName}
                    src={avatar ? generateAWSUrl(avatar) : ""}
                  />
                  <Text>{firstName + " " + lastName}</Text>
                </HStack>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </SharedModal>
  );
};

export default memo(ChangeInstructorsModal);
