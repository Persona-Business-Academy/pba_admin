"use client";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { BsThreeDots } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import {
  ChangeInstructorsModal,
  CreateEditOfflineCourseModal,
  DeleteOfflineCourseModal,
  GraduationPhotoModal,
  SearchTable,
  VideosModal,
  WhatYouWillLearnPhotoModal,
} from "@/components/molecule";
import useDebounce from "@/hooks/useDebounce";
import { ApplicantEnum, ITEMS_PER_PAGE } from "@/utils/constants/common";
import {
  APPLICANTS_ROUTE,
  OFFLINE_COURSES_FOR_KIDS_ROUTE,
  OFFLINE_COURSES_ROUTE,
} from "@/utils/constants/routes";
import { generateOfflineCourseUrl } from "@/utils/helpers/common";
import { QUERY_KEY } from "@/utils/helpers/queryClient";
import { Maybe } from "@/utils/models/common";
import { OfflineCourse } from "@/utils/models/offlineCourses";
import TimelineModal from "../molecule/modals/OfflineCourse/TimelineModal";

interface Props {
  forKids: boolean;
}

const OfflineCoursePage: FC<Props> = ({ forKids }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const { value: url, onCopy, setValue: setUrl } = useClipboard("");
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
  const timeLineModal = useDisclosure({
    onClose() {
      if (!!editableOfflineCourse) setEditableOfflineCourse(null);
    },
  });
  const graduationPhotoModal = useDisclosure({
    onClose() {
      if (!!editableOfflineCourse) setEditableOfflineCourse(null);
    },
  });
  const whatYouWillLearnPhotoModal = useDisclosure({
    onClose() {
      if (!!editableOfflineCourse) setEditableOfflineCourse(null);
    },
  });

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: QUERY_KEY.allOfflineCourses(debouncedSearch, page, forKids),
    queryFn: () =>
      OfflineCourseService.getAllOfflineCourses({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sorting: sorting,
        search: debouncedSearch,
        forKids,
      }),
    keepPreviousData: true,
  });

  const videos = useMemo(
    () =>
      data?.offlineCourses.find(({ id }) => id === editableOfflineCourse?.id)
        ?.offlineCourseVideos || [],
    [data?.offlineCourses, editableOfflineCourse?.id],
  );

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
        cell: info => (
          <Button
            variant="link"
            as={Link}
            href={`${APPLICANTS_ROUTE}?filter=${ApplicantEnum.OFFLINE_COURSE_APPLICANT}&filterId=${info.getValue()}`}>
            {`Applicants >`}
          </Button>
        ),
        header: "Applicants",
      }),
      columnHelper.accessor("id", {
        id: uuidv4(),
        cell: info => {
          const id = info.getValue();
          return (
            <Button
              variant="link"
              as={Link}
              href={`${
                forKids ? OFFLINE_COURSES_FOR_KIDS_ROUTE : OFFLINE_COURSES_ROUTE
              }/${id}/comments`}>
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
        cell: ({ row, getValue }) => (
          <Menu>
            <MenuButton as={IconButton} icon={<BsThreeDots />} />
            <MenuList>
              <MenuItem
                onClick={() => {
                  setEditableOfflineCourse(row.original);
                  onOpen();
                }}>
                Edit
              </MenuItem>
              <MenuItem
                disabled={!(row.original?.id && row.original?.title)}
                onClick={() => {
                  if (row.original?.id && row.original?.title) {
                    setUrl(generateOfflineCourseUrl(row.original.id, row.original.title));
                  }
                }}>
                Copy url
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setEditableOfflineCourse(row.original);
                  instructorsModal.onOpen();
                }}>
                Add Instructors
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setEditableOfflineCourse(row.original);
                  videosModal.onOpen();
                }}>
                Add Videos
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setEditableOfflineCourse(row.original);
                  timeLineModal.onOpen();
                }}>
                Add Timeline
              </MenuItem>
              <MenuItem
                as={Link}
                href={`${
                  forKids ? OFFLINE_COURSES_FOR_KIDS_ROUTE : OFFLINE_COURSES_ROUTE
                }/${getValue()}/pdf`}>
                Attach Pdf
              </MenuItem>
              {!forKids && (
                <>
                  <MenuItem
                    color="green"
                    onClick={() => {
                      setEditableOfflineCourse(row.original);
                      graduationPhotoModal.onOpen();
                    }}>
                    Add graduation photo
                  </MenuItem>
                  <MenuItem
                    color="green"
                    onClick={() => {
                      setEditableOfflineCourse(row.original);
                      whatYouWillLearnPhotoModal.onOpen();
                    }}>
                    Add what you will learn photo
                  </MenuItem>
                </>
              )}

              <MenuItem
                color="red"
                onClick={() => {
                  setDeletableOfflineCourse(row.original);
                  deleteModal.onOpen();
                }}>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        ),
        header: "Actions",
      }),
    ],
    [
      columnHelper,
      deleteModal,
      forKids,
      graduationPhotoModal,
      instructorsModal,
      onOpen,
      setUrl,
      timeLineModal,
      videosModal,
      whatYouWillLearnPhotoModal,
    ],
  );

  useEffect(() => {
    if (url) {
      onCopy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <>
      <SearchTable
        title={forKids ? "Offline courses for kids" : "Offline courses"}
        isLoading={isLoading}
        rowCondition={"disabled"}
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
          forKids={forKids}
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
          mediaId={editableOfflineCourse.mediaId}
          onClose={videosModal.onClose}
          refetch={refetch}
          videos={videos}
        />
      )}
      {timeLineModal.isOpen && editableOfflineCourse && (
        <TimelineModal offlineCourseId={editableOfflineCourse.id} onClose={timeLineModal.onClose} />
      )}
      {graduationPhotoModal.isOpen && editableOfflineCourse && (
        <GraduationPhotoModal
          offlineCourseId={editableOfflineCourse.id}
          onClose={graduationPhotoModal.onClose}
        />
      )}
      {whatYouWillLearnPhotoModal.isOpen && editableOfflineCourse && (
        <WhatYouWillLearnPhotoModal
          offlineCourseId={editableOfflineCourse.id}
          onClose={whatYouWillLearnPhotoModal.onClose}
        />
      )}
    </>
  );
};

export default memo(OfflineCoursePage);
