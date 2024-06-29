import { LogoutResponse } from "../../../domain/models/User";
import { authRepository } from "../../services/repositories/auth-repository";

export const signoutUser = async (token: string): Promise<LogoutResponse> => {
  return await authRepository.logout(token);
};
