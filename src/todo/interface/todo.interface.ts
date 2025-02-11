import { IUser } from "src/users/interfaces/user.interface";

export interface ITodo{
  id?: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user?: IUser
}