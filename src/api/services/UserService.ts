import { UserModel } from "@/models/user";
import $apiClient from "..";

export class UserService {
 static async getAllUsers(params: any): Promise<UserModel[]> {
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
