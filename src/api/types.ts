export type UsersParamsInput = {
 limit: number;
 offset: number;
 sorting: {
  id: string;
  desc: boolean;
 }[];
 search: string;
};
