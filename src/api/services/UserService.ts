import { UsersListModel } from "@/utils/models/user";
import $apiClient from "..";
import { QueryParams } from "../types";

export class UserService {
  static getAllUsers(params: QueryParams) {
    return $apiClient.get<UsersListModel>("/users/list", { params });
  }
}
