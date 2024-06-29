import { LoginRequest, LoginResponse } from "../../../domain/models/User";
import { authRepository } from "../../services/repositories/auth-repository";

export const signinUser = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  return await authRepository.login(payload);
};
