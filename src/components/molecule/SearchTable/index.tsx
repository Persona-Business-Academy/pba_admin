import React, { Dispatch, SetStateAction, useCallback } from "react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
 Box,
 chakra,
 Flex,
 FormControl,
 FormLabel,
 IconButton,
 Input,
 Table,
 Tbody,
 Td,
 Text,
 Th,
 Thead,
 Tr,
} from "@chakra-ui/react";
import {
 ColumnDef,
 flexRender,
 getCoreRowModel,
 getSortedRowModel,
 SortingState,
 useReactTable,
} from "@tanstack/react-table";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export type DataTableProps<Data extends object> = {
 data: Data[];
 columns: ColumnDef<Data, any>[];
 sorting: SortingState;
 setSorting: Dispatch<SetStateAction<SortingState>>;
 setSearch: Dispatch<SetStateAction<string>>;
 search: string;
};

function SearchTable<Data extends object>({
 data,
 columns,
 sorting,
 setSorting,
 setSearch,
 search,
}: DataTableProps<Data>) {
 const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  onSortingChange: setSorting,
  getSortedRowModel: getSortedRowModel(),
  state: {
   sorting,
   pagination: {
    pageIndex: 1,
    pageSize: 10,
   },
  },
 });

 const userSearchHandler = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
   setSearch(e.target.value);
  },
  [setSearch]
 );

 return (
  <Box border="1px solid rgb(226, 232, 240)" overflow="auto">
   <Text as="h2" fontSize={24} textAlign="center">
    USERS LIST
   </Text>
   <FormControl py={4} px={4}>
    <FormLabel mb="3px">Search Users</FormLabel>
    <Input
     placeholder="Type here to search users"
     width="200px"
     onChange={userSearchHandler}
     value={search}
    />
   </FormControl>
   <Table borderTop="1px solid rgb(226, 232, 240)">
    <Thead>
     {table.getHeaderGroups().map((headerGroup) => (
      <Tr key={headerGroup.id}>
       {headerGroup.headers.map((header) => {
        const meta: any = header.column.columnDef.meta;
        return (
         <Th
          key={header.id}
          onClick={header.column.getToggleSortingHandler()}
          isNumeric={meta?.isNumeric}
         >
          {flexRender(header.column.columnDef.header, header.getContext())}

          <chakra.span pl="4">
           {header.column.getIsSorted() ? (
            header.column.getIsSorted() === "desc" ? (
             <TriangleDownIcon aria-label="sorted descending" />
            ) : (
             <TriangleUpIcon aria-label="sorted ascending" />
            )
           ) : null}
          </chakra.span>
         </Th>
        );
       })}
      </Tr>
     ))}
    </Thead>
    <Tbody>
     {table.getRowModel().rows.map((row) => (
      <Tr key={row.id}>
       {row.getVisibleCells().map((cell) => {
        const meta: any = cell.column.columnDef.meta;
        return (
         <>
          <Td key={cell.id} isNumeric={meta?.isNumeric}>
           {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Td>
         </>
        );
       })}
      </Tr>
     ))}
    </Tbody>
   </Table>
   <Flex>
    <IconButton
     className="border rounded p-1"
     aria-label="chevron-left"
     onClick={() => table.previousPage()}
     disabled={!table.getCanPreviousPage()}
     icon={<BsChevronLeft />}
    >
     {"<"}
    </IconButton>
    <IconButton
     aria-label="chevron-right"
     className="border rounded p-1"
     onClick={() => table.nextPage()}
     disabled={!table.getCanNextPage()}
     icon={<BsChevronRight />}
    >
     {">"}
    </IconButton>
    <Text as="span">Page</Text>
    <Text as="strong">
     {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    </Text>
    <span className="flex items-center gap-1">
     | Go to page:
     <input
      type="number"
      defaultValue={table.getState().pagination.pageIndex + 1}
      onChange={(e) => {
       const page = e.target.value ? Number(e.target.value) - 1 : 0;
       table.setPageIndex(page);
      }}
      className="border p-1 rounded w-16"
     />
    </span>
    <select
     value={table.getState().pagination.pageSize}
     onChange={(e) => {
      table.setPageSize(Number(e.target.value));
     }}
    >
     {[10, 20, 30, 40, 50].map((pageSize) => (
      <option key={pageSize} value={pageSize}>
       Show {pageSize}
      </option>
     ))}
    </select>
   </Flex>
  </Box>
 );
}

export default SearchTable;
