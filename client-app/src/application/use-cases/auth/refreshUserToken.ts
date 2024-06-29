import { LoginResponse } from "../../../domain/models/User";
import { authRepository } from "../../services/repositories/auth-repository";

export const refreshUserToken = async (
  token: string
): Promise<LoginResponse> => {
  return await authRepository.refreshToken(token);
};
