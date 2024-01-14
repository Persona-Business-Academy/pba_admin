"use client";
import { useCallback, useMemo, useState } from "react";
import { Button, HStack, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import {
  ChangeInstructorsModal,
  CreateEditOfflineCourseModal,
  DeleteOfflineCourseModal,
  SearchTable,
  VideosModal,
} from "@/components/molecule";
import { useDebounce } from "@/hooks/useDebounce";
import { ITEMS_PER_PAGE } from "@/utils/constants/common";
import { QUERY_KEY } from "@/utils/helpers/queryClient";
import { Maybe } from "@/utils/models/common";
import { OfflineCourse } from "@/utils/models/offlineCourses";

export default function OfflineCourses() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [editableOfflineCourse, setEditableOfflineCourse] = useState<Maybe<OfflineCourse>>(null);
  const [deletableOfflineCourse, setDeletableOfflineCourse] = useState<Maybe<OfflineCourse>>(null);

  const instructorsModal = useDisclosure();
  const videosModal = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      if (!!editableOfflineCourse) setEditableOfflineCourse(null);
    },
  });
  const deleteModal = useDisclosure({
    onClose() {
      if (!!deletableOfflineCourse) setDeletableOfflineCourse(null);
    },
  });

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: QUERY_KEY.allOfflineCourses(debouncedSearch, page),
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
          return <Button>{id}</Button>;
        },
        header: "ID",
      }),
      columnHelper.accessor("title", {
        id: uuidv4(),
        cell: info => info.getValue(),
        header: "Title",
      }),
      columnHelper.accessor("id", {
        id: uuidv4(),
        cell: info => {
          const id = info.getValue();
          return (
            <Button variant="link" as={Link} href={`/offline-courses/${id}/comments`}>
              {`Comments >`}
            </Button>
          );
        },
        header: "Comments",
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
              colorScheme="blue"
              variant="outline"
              onClick={() => {
                setEditableOfflineCourse(row.original);
                instructorsModal.onOpen();
              }}>
              Add Instructors
            </Button>
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => {
                setEditableOfflineCourse(row.original);
                videosModal.onOpen();
              }}>
              Add Videos
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                setDeletableOfflineCourse(row.original);
                deleteModal.onOpen();
              }}>
              Delete
            </Button>
          </HStack>
        ),
        header: "Actions",
      }),
    ],
    [columnHelper, deleteModal, instructorsModal, onOpen, videosModal],
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
      {instructorsModal.isOpen && !!editableOfflineCourse && (
        <ChangeInstructorsModal
          isOpen
          offlineCourseId={editableOfflineCourse.id}
          onClose={instructorsModal.onClose}
        />
      )}
      {deleteModal.isOpen && !!deletableOfflineCourse && (
        <DeleteOfflineCourseModal
          isOpen
          offlineCourse={deletableOfflineCourse}
          onClose={deleteModal.onClose}
          onSave={refetch}
        />
      )}
      {videosModal.isOpen && editableOfflineCourse && (
        <VideosModal
          offlineCourseId={editableOfflineCourse.id}
          onClose={deleteModal.onClose}
          refetch={refetch}
          videos={editableOfflineCourse.OfflineCourseVideo}
        />
      )}
    </>
  );
}
