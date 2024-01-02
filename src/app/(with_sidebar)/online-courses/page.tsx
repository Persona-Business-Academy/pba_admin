"use client";
import { useCallback, useMemo, useState } from "react";
import { Button, HStack, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { OnlineCourseService } from "@/api/services/OnlineCourseService";
import {
  CreateEditOnlineCourseModal,
  DeleteOnlineCourseModal,
  SearchTable,
} from "@/components/molecule";
import { useDebounce } from "@/hooks/useDebounce";
import { ITEMS_PER_PAGE } from "@/utils/constants/common";
import { Maybe } from "@/utils/models/common";
import { OnlineCourse } from "@/utils/models/onlineCourses";

export default function OnlineCourses() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [editableOnlineCourse, setEditableOnlineCourse] = useState<Maybe<OnlineCourse>>(null);
  const [deletableOnlineCourse, setDeletableOnlineCourse] = useState<Maybe<OnlineCourse>>(null);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      if (!!editableOnlineCourse) setEditableOnlineCourse(null);
    },
  });

  const {
    isOpen: isOpenDeleteOnlineCourse,
    onOpen: onOpenDeleteOnlineCourse,
    onClose: onCloseDeleteOnlineCourse,
  } = useDisclosure({
    onClose() {
      if (!!deletableOnlineCourse) setDeletableOnlineCourse(null);
    },
  });

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: [
      debouncedSearch ? `all-online-courses/${debouncedSearch}` : "all-online-courses",
      page,
    ],
    queryFn: () =>
      OnlineCourseService.getAllOnlineCourses({
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

  const columnHelper = useMemo(() => createColumnHelper<OnlineCourse>(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        id: uuidv4(),
        cell: info => {
          const id = info.getValue();
          return (
            <Button as={Link} href={`/online-courses/${id}`}>
              {id}
            </Button>
          );
        },
        header: "ID",
      }),
      columnHelper.accessor("title", {
        id: uuidv4(),
        cell: info => info.getValue(),
        header: "Title",
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
                setEditableOnlineCourse(row.original);
                onOpen();
              }}>
              Edit
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                setDeletableOnlineCourse(row.original);
                onOpenDeleteOnlineCourse();
              }}>
              Delete
            </Button>
          </HStack>
        ),
        header: "Actions",
      }),
    ],
    [columnHelper, onOpen, onOpenDeleteOnlineCourse],
  );

  return (
    <>
      <SearchTable
        title="Online Courses"
        isLoading={isLoading}
        data={data?.onlineCourses || []}
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
        <CreateEditOnlineCourseModal
          isOpen
          onlineCourse={editableOnlineCourse}
          onClose={onClose}
          onSave={refetch}
        />
      )}
      {isOpenDeleteOnlineCourse && !!deletableOnlineCourse && (
        <DeleteOnlineCourseModal
          isOpen
          onlineCourse={deletableOnlineCourse}
          onClose={onCloseDeleteOnlineCourse}
          onSave={refetch}
        />
      )}
    </>
  );
}
