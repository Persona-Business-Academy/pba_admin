import { UsersListModel } from "@/utils/models/user";
import $apiClient from "..";
import { QueryParams } from "../types";

export class UserService {
  static getAllUsers(params: QueryParams): Promise<UsersListModel> {
    return $apiClient.get("/users/list", {
      params: {
        limit: params.limit,
        offset: params.offset,
        sorting: params.sorting,
        search: params.search,
      },
    });
  }
}
