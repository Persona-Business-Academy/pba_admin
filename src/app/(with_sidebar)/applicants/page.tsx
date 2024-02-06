"use client";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ApplicantService } from "@/api/services/ApplicantService";
import { SearchTable } from "@/components/molecule";
import useDebounce from "@/hooks/useDebounce";
import { ApplicantEnum, ITEMS_PER_PAGE } from "@/utils/constants/common";
import { QUERY_KEY } from "@/utils/helpers/queryClient";
import { ApplicantEnumType, ApplicantModel } from "@/utils/models/common";

const title: Record<ApplicantEnumType, string> = {
  JOB_APPLICANT: "Job Applicants",
  CONTACT_US_APPLICANT: "Contact us applicants",
  OFFLINE_COURSE_APPLICANT: "Offline course applicants",
};

export default function Applicants() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const searchParams = useSearchParams();
  const searchParamFilter = useMemo(
    () => ApplicantEnum[searchParams?.get("filter") as ApplicantEnumType] || undefined,
    [searchParams],
  );

  const filterId = useMemo(() => {
    const obj: Record<string, "jobId" | "offlineCourseId"> = {
      JOB_APPLICANT: "jobId",
      OFFLINE_COURSE_APPLICANT: "offlineCourseId",
    };
    const id = searchParams?.get("filterId");
    const key = obj[searchParamFilter];

    if (key && id) {
      return { [key]: id };
    }
    return {};
  }, [searchParamFilter, searchParams]);

  const { data, isLoading, isPreviousData } = useQuery({
    queryKey: QUERY_KEY.allApplicants(debouncedSearch, page, filterId, searchParamFilter),
    queryFn: () =>
      ApplicantService.getAll({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sorting: sorting,
        search: debouncedSearch,
        filter: searchParamFilter,
        ...filterId,
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

  const columnHelper = useMemo(() => createColumnHelper<ApplicantModel>(), []);

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
      columnHelper.accessor("email", {
        id: uuidv4(),
        cell: info => info.getValue(),
        header: "Email",
      }),
      columnHelper.accessor("for", {
        id: uuidv4(),
        cell: info => info.getValue(),
        header: "For",
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
    ],
    [columnHelper],
  );

  return (
    <SearchTable
      title={title[searchParamFilter] || "Applicants"}
      isLoading={isLoading}
      data={data?.applicants || []}
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
    />
  );
}
