"use client";
import { useCallback, useMemo, useState } from "react";
import { Button, HStack, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { JobService } from "@/api/services/JobService";
import { CreateEditJobModal, DeleteJobModal, SearchTable } from "@/components/molecule";
import useDebounce from "@/hooks/useDebounce";
import { ApplicantEnum, ITEMS_PER_PAGE } from "@/utils/constants/common";
import { APPLICANTS_ROUTE, JOBS_ROUTE } from "@/utils/constants/routes";
import { QUERY_KEY } from "@/utils/helpers/queryClient";
import { Maybe } from "@/utils/models/common";
import { JobModel } from "@/utils/models/job";

export default function Jobs() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [editableJob, setEditableJob] = useState<Maybe<JobModel>>(null);
  const [deletableJob, setDeletableJob] = useState<Maybe<JobModel>>(null);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      if (!!editableJob) setEditableJob(null);
    },
  });

  const {
    isOpen: isOpenDeleteJob,
    onOpen: onOpenDeleteJob,
    onClose: onCloseDeleteJob,
  } = useDisclosure({
    onClose() {
      if (!!deletableJob) setDeletableJob(null);
    },
  });

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: QUERY_KEY.allJobs(debouncedSearch, page),
    queryFn: () =>
      JobService.getAll({
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

  const columnHelper = useMemo(() => createColumnHelper<JobModel>(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        id: uuidv4(),
        cell: info => {
          const id = info.getValue();
          return (
            <Button as={Link} href={`${JOBS_ROUTE}/${id}`}>
              {id}
            </Button>
          );
        },
        header: "ID",
      }),
      columnHelper.accessor("id", {
        id: uuidv4(),
        cell: info => (
          <Button
            variant="link"
            as={Link}
            href={`${APPLICANTS_ROUTE}?filter=${ApplicantEnum.JOB_APPLICANT}&filterId=${info.getValue()}`}>
            {`Applicants >`}
          </Button>
        ),
        header: "Applicants",
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
                setEditableJob(row.original);
                onOpen();
              }}>
              Edit
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                setDeletableJob(row.original);
                onOpenDeleteJob();
              }}>
              Delete
            </Button>
          </HStack>
        ),
        header: "Actions",
      }),
    ],
    [columnHelper, onOpen, onOpenDeleteJob],
  );

  return (
    <>
      <SearchTable
        title="Jobs"
        isLoading={isLoading}
        data={data?.jobs || []}
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
      {isOpen && <CreateEditJobModal job={editableJob} onClose={onClose} onSave={refetch} />}
      {isOpenDeleteJob && !!deletableJob && (
        <DeleteJobModal job={deletableJob} onClose={onCloseDeleteJob} onSave={refetch} />
      )}
    </>
  );
}
