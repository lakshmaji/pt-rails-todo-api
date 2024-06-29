import {
  CreateUserRequest,
  CreateUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
} from "../models/User";

export interface IAuthRepository {
  createAccount(payload: CreateUserRequest): Promise<CreateUserResponse>;
  login(payload: LoginRequest): Promise<LoginResponse>;
  logout(token: string): Promise<LogoutResponse>;
  refreshToken(token: string): Promise<LoginResponse>;
}
