"use client";
import React, { FC, useEffect, useState } from "react";
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
import { UserModel } from "@/models/user";

type Props = {};

const UsersList: FC<Props> = () => {
 const [sorting, setSorting] = React.useState<SortingState>([]);
 const [search, setSearch] = useState("");

 const ITEMS_PER_PAGE = 20;
 const toast = useToast();

 const {
  isLoading,
  data,
  hasNextPage,
  hasPreviousPage,
  fetchNextPage,
  fetchPreviousPage,
  refetch,
 } = useInfiniteQuery<any, any, Array<UserModel>>(
  ["all-users"],
  () =>
   UserService.getAllUsers({
    offset: 0,
    limit: ITEMS_PER_PAGE,
    sorting,
    search,
   }),
  {
   getNextPageParam: (lastPage: Array<UserModel>, pages) => {
    if (lastPage?.length < ITEMS_PER_PAGE) {
     return false;
    }
    return pages.length * ITEMS_PER_PAGE;
   },
   onError: () => {
    toast({
     title: "Something went wrong",
     status: "error",
    });
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

 return (
  <SearchTable
   isLoading={isLoading}
   data={data?.pages[0] || []}
   columns={columns}
   sorting={sorting}
   setSorting={setSorting}
   setSearch={setSearch}
   search={search}
   hasNextPage={!!hasNextPage}
   hasPreviousPage={!!hasPreviousPage}
   fetchNextPage={fetchNextPage}
   fetchPreviousPage={fetchPreviousPage}
  />
 );
};

export default UsersList;
