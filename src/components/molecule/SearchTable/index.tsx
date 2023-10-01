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
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
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
  isLoading: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
};

function SearchTable<Data extends object>({
  data,
  columns,
  sorting,
  setSorting,
  setSearch,
  search,
  isLoading,
  hasNextPage,
  hasPreviousPage,
  fetchNextPage,
  fetchPreviousPage,
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
        pageIndex: 0,
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
    <Box
      border="1px solid rgb(226, 232, 240)"
      overflow="auto"
      minHeight="700px"
    >
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
      {isLoading ? (
        <Flex alignItems="center" justifyContent="center" minHeight="500px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      ) : (
        <Table borderTop="1px solid rgb(226, 232, 240)" height="100%">
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
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

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
                    <Td key={cell.id} isNumeric={meta?.isNumeric}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td align="left" colSpan={5}>
                <Text>Users count 12</Text>
              </Td>
              <Td>
                <IconButton
                  className="border rounded p-1"
                  aria-label="chevron-left"
                  onClick={fetchPreviousPage}
                  bg="transparent"
                  icon={<BsChevronLeft />}
                  isDisabled={hasPreviousPage}
                >
                  {"<"}
                </IconButton>
                <IconButton
                  aria-label="chevron-right"
                  className="border rounded p-1"
                  bg="transparent"
                  onClick={fetchNextPage}
                  icon={<BsChevronRight />}
                  isDisabled={!hasNextPage}
                >
                  {">"}
                </IconButton>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      )}
    </Box>
  );
}

export default SearchTable;
