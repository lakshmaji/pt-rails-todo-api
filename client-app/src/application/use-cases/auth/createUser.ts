import { CreateUserRequest, IUser } from "../../../domain/models/User";
import { authRepository } from "../../services/repositories/auth-repository";

export const createUser = async (
  payload: CreateUserRequest
): Promise<IUser> => {
  return (await authRepository.createAccount(payload)).user;
};
