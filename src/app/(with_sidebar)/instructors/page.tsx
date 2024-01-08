"use client";
import { useCallback, useMemo, useState } from "react";
import { Button, HStack, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { InstructorService } from "@/api/services/InstructorsService";
import {
  CreateEditInstructorModal,
  DeleteInstructorModal,
  SearchTable,
} from "@/components/molecule";
import { useDebounce } from "@/hooks/useDebounce";
import { ITEMS_PER_PAGE } from "@/utils/constants/common";
import { INSTRUCTORS } from "@/utils/constants/routes";
import { Maybe } from "@/utils/models/common";
import { InstructorType } from "@/utils/models/instructors";

export default function Instructors() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [editableInstructor, setEditableInstructor] = useState<Maybe<InstructorType>>(null);
  const [deletableInstructor, setDeletableInstructor] = useState<Maybe<InstructorType>>(null);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      if (!!editableInstructor) setEditableInstructor(null);
    },
  });

  const {
    isOpen: isOpenDeleteInstructor,
    onOpen: onOpenDeleteInstructor,
    onClose: onCloseDeleteInstructor,
  } = useDisclosure({
    onClose() {
      if (!!deletableInstructor) setDeletableInstructor(null);
    },
  });

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: [debouncedSearch ? `all-instructors/${debouncedSearch}` : "all-instructors", page],
    queryFn: () =>
      InstructorService.getAllInstructors({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sorting: sorting,
        search: debouncedSearch,
      }),
    keepPreviousData: true,
  });

  const pageCount = useMemo(() => {
    if (data?.count) {
      return Math.ceil(data.count / ITEMS_PER_PAGE);
    }
  }, [data?.count]);

  const setSearchValue = useCallback(
    (value: string) => {
      if (!!value && page !== 1) {
        setPage(1);
      }
      setSearch(value);
    },
    [page],
  );

  const columnHelper = useMemo(() => createColumnHelper<InstructorType>(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        id: uuidv4(),
        cell: info => {
          const id = info.getValue();
          return (
            <Button as={Link} href={`${INSTRUCTORS}/${id}`}>
              {id}
            </Button>
          );
        },
        header: "ID",
      }),
      columnHelper.accessor("firstName", {
        id: uuidv4(),
        cell: info => info.getValue(),
        header: "First Name",
      }),
      columnHelper.accessor("lastName", {
        id: uuidv4(),
        cell: info => info.getValue(),
        header: "First Name",
      }),
      columnHelper.accessor("profession", {
        id: uuidv4(),
        cell: info => info.getValue(),
        header: "Profession",
      }),
      columnHelper.accessor("createdAt", {
        id: uuidv4(),
        cell: info => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
        header: "Created At",
      }),
      columnHelper.accessor("updatedAt", {
        id: uuidv4(),
        cell: info => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
        header: "Updated At",
      }),
      columnHelper.accessor("id", {
        id: uuidv4(),
        cell: ({ row }) => (
          <HStack spacing={2}>
            <Button
              colorScheme="blue"
              onClick={() => {
                setEditableInstructor(row.original);
                onOpen();
              }}>
              Edit
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                setDeletableInstructor(row.original);
                onOpenDeleteInstructor();
              }}>
              Delete
            </Button>
          </HStack>
        ),
        header: "Actions",
      }),
    ],
    [columnHelper, onOpen, onOpenDeleteInstructor],
  );

  return (
    <>
      <SearchTable
        title="Instructors"
        isLoading={isLoading}
        data={data?.instructors || []}
        count={data?.count || 0}
        // @ts-ignore
        columns={columns}
        sorting={sorting}
        search={search}
        setSorting={setSorting}
        setSearch={setSearchValue}
        hasNextPage={useMemo(
          () => !(!pageCount || page === pageCount || isPreviousData),
          [isPreviousData, page, pageCount],
        )}
        hasPreviousPage={useMemo(() => !(page === 1 || isPreviousData), [isPreviousData, page])}
        fetchNextPage={useCallback(() => setPage(prev => ++prev), [])}
        fetchPreviousPage={useCallback(() => setPage(prev => --prev), [])}
        addNew={onOpen}
      />
      {isOpen && (
        <CreateEditInstructorModal
          isOpen
          instructor={editableInstructor}
          onClose={onClose}
          onSave={refetch}
        />
      )}
      {isOpenDeleteInstructor && !!deletableInstructor && (
        <DeleteInstructorModal
          isOpen
          instructor={deletableInstructor}
          onClose={onCloseDeleteInstructor}
          onSave={refetch}
        />
      )}
    </>
  );
}
