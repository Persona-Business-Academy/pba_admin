"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { UserService } from "@/api/services/UserService";
import { SearchTable } from "@/components/molecule";
import { UserModel, UsersListModel } from "@/models/user";

type Props = {};

const UsersList: FC<Props> = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const ITEMS_PER_PAGE = 5;
  const toast = useToast();

  const {
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    fetchPreviousPage,
    refetch,
  } = useInfiniteQuery<any, any, UsersListModel>(
    ["all-users"],
    ({ pageParam = 0 }) =>
      UserService.getAllUsers({
        offset: pageParam,
        limit: ITEMS_PER_PAGE,
        sorting,
        search,
      }),
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage: Array<UserModel>, pages) => {
        if (lastPage?.length < ITEMS_PER_PAGE) {
          return false; // No more pages to fetch
        }
        return pages.length * ITEMS_PER_PAGE;
      },
      // TODO Previous page is not working

      getPreviousPageParam: (data: UsersListModel, pages) => {
        console.log(pages[pages.length - 1], "pages[pages.length - 1]");

        if (!data.skip) {
          return false; // No previous page to fetch
        }
        return (pages.length - 1) * ITEMS_PER_PAGE;
      },
      onError: () => {
        toast({
          title: "Something went wrong",
          status: "error",
        });
      },
      select: (data) => {
        return {
          pages: [data.pages[data.pages.length - 1]],
          pageParams: [data.pageParams[data.pageParams.length - 1]],
        };
      },
    }
  );

  const columnHelper = createColumnHelper<UserModel>();

  const columns: ColumnDef<UserModel, any>[] = [
    columnHelper.accessor("firstName", {
      cell: (info) => info.getValue(),
      header: "First Name",
    }),
    columnHelper.accessor("lastName", {
      cell: (info) => info.getValue(),
      header: "Last Name",
    }),
    columnHelper.accessor("email", {
      cell: (info) => info.getValue(),
      header: "Email",
    }),
    columnHelper.accessor("createdAt", {
      cell: (info) => {
        const currentDate = dayjs(info.getValue());
        return currentDate.format("YYYY-MM-DD HH:mm:ss");
      },
      header: "Created At",
    }),
    columnHelper.accessor("createdAt", {
      cell: () => (
        <div style={{ display: "flex", gap: 20 }}>
          <span>Delete</span>
          <span>Block</span>
        </div>
      ),
      header: "Action Buttons",
    }),
  ];

  useEffect(() => {
    const timeOut = setTimeout(() => refetch(), 500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [refetch, search]);

  const currentPageData = useMemo(
    () => data?.pages[data.pages.length - 1].users || [],
    [data]
  );

  const hasPreviousPage = useMemo(
    () => data?.pages[data.pages.length - 1].skip || 0,
    [data?.pages]
  );

  return (
    <SearchTable
      isLoading={isLoading}
      data={currentPageData}
      columns={columns}
      sorting={sorting}
      setSorting={setSorting}
      setSearch={setSearch}
      search={search}
      hasNextPage={!!hasNextPage}
      hasPreviousPage={!hasPreviousPage}
      fetchNextPage={fetchNextPage}
      fetchPreviousPage={fetchPreviousPage}
    />
  );
};

export default UsersList;
