import { UsersListModel } from "@/models/user";
import $apiClient from "..";
import { UsersParamsInput } from "../types";

export class UserService {
  static getAllUsers(params: UsersParamsInput): Promise<UsersListModel> {
    return $apiClient.get("/users/list", {
      params: {
        limit: params.limit,
        offset: params.offset,
        sorting: params.sorting,
        search: params.search,
      },
    });
  }

  getUserById() {}
}
