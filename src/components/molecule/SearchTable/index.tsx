import React, { Dispatch, SetStateAction, useCallback } from "react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
 Box,
 chakra,
 FormControl,
 FormLabel,
 Input,
 Table,
 Tbody,
 Td,
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

export type DataTableProps<Data extends object> = {
 data: Data[];
 columns: ColumnDef<Data, any>[];
 sorting: SortingState;
 setSorting: Dispatch<SetStateAction<SortingState>>;
 setSearch: Dispatch<SetStateAction<string>>;
 search: string;
};

export function DataTable<Data extends object>({
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
  },
 });

 const userSearchHandler = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
   setSearch(e.target.value);
  },
  [setSearch]
 );

 return (
  <Box border="1px solid rgb(226, 232, 240)">
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
  </Box>
 );
}
