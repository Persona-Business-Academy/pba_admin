import { SortingType } from "@/api/types";

export const orderBy = (sorting: SortingType[]) => {
  let data: Record<string, "asc" | "desc"> = {}; // Initialize an empty object for orderBy
  if (sorting && sorting.length > 0) {
    const sortingField = sorting[0].id; // Get the sorting field from the first item in the array
    const sortingDirection = sorting[0].desc ? "desc" : "asc"; // Check if it's descending or ascending
    data[sortingField] = sortingDirection; // Set the orderBy object
  }

  return data;
};
