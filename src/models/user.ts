export type UserModel = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

export type UsersListModel = {
  users: UserModel[];
  count: number;
  skip: number;
};
