"use client";
import { useCallback, useMemo, useState } from "react";
import { Button, HStack, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { CreateEditOfflineCourseModal, SearchTable } from "@/components/molecule";
import DeleteOfflineCourseModal from "@/components/molecule/modals/OfflineCourse/DeleteOfflineCourseModal";
import { ITEMS_PER_PAGE } from "@/constants/common";
import { useDebounce } from "@/hooks/useDebounce";
import { Maybe } from "@/models/common";
import { OfflineCourse } from "@/models/offlineCourses";

export default function OfflineCourses() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [editableOfflineCourse, setEditableOfflineCourse] = useState<Maybe<OfflineCourse>>(null);
  const [deletableOfflineCourse, setDeletableOfflineCourse] = useState<Maybe<OfflineCourse>>(null);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      if (!!editableOfflineCourse) setEditableOfflineCourse(null);
    },
  });

  const {
    isOpen: isOpenDeleteOfflineCourse,
    onOpen: onOpenDeleteOfflineCourse,
    onClose: onCloseDeleteOfflineCourse,
  } = useDisclosure({
    onClose() {
      if (!!deletableOfflineCourse) setDeletableOfflineCourse(null);
    },
  });

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: [
      debouncedSearch ? `all-offline-courses/${debouncedSearch}` : "all-offline-courses",
      page,
    ],
    queryFn: () =>
      OfflineCourseService.getAllOfflineCourses({
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

  const columnHelper = useMemo(() => createColumnHelper<OfflineCourse>(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        id: uuidv4(),
        cell: info => {
          const id = info.getValue();
          return (
            <Button as={Link} href={`/offline-courses/${id}`}>
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
                setEditableOfflineCourse(row.original);
                onOpen();
              }}>
              Edit
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                setDeletableOfflineCourse(row.original);
                onOpenDeleteOfflineCourse();
              }}>
              Delete
            </Button>
          </HStack>
        ),
        header: "Actions",
      }),
    ],
    [columnHelper, onOpen, onOpenDeleteOfflineCourse],
  );

  return (
    <>
      <SearchTable
        title="Offline Courses"
        isLoading={isLoading}
        data={data?.offlineCourses || []}
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
        <CreateEditOfflineCourseModal
          isOpen
          offlineCourse={editableOfflineCourse}
          onClose={onClose}
          onSave={refetch}
        />
      )}
      {isOpenDeleteOfflineCourse && !!deletableOfflineCourse && (
        <DeleteOfflineCourseModal
          isOpen
          offlineCourse={deletableOfflineCourse}
          onClose={onCloseDeleteOfflineCourse}
          onSave={refetch}
        />
      )}
    </>
  );
}
