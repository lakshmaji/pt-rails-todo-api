import {
  CreateUserRequest,
  CreateUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
} from "../../../domain/models/User";
import { IAuthRepository } from "../../../domain/repositories/auth-repository";
import { authApiService } from "../api/auth-api";

class AuthRepository implements IAuthRepository {
  async createAccount(payload: CreateUserRequest): Promise<CreateUserResponse> {
    const result = await authApiService.createAccount({
      user: payload,
      client_id: "webapp_id",
    });
    return result.data;
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const result = await authApiService.login({
      ...payload,
      grant_type: "password",
      client_id: "webapp_id",
      client_secret: "web_app_secret",
      // redirect_uri: "",
    });
    return result.data;
  }

  async logout(token: string): Promise<LogoutResponse> {
    const result = await authApiService.logout({
      token,
      client_id: "webapp_id",
      client_secret: "web_app_secret",
    });
    return result.data;
  }

  async refreshToken(token: string): Promise<LoginResponse> {
    const result = await authApiService.refreshToken({
      refresh_token: token,
      grant_type: "refresh_token",
      client_id: "webapp_id",
      client_secret: "web_app_secret",
      // redirect_uri: "",
    });
    return result?.data;
  }
}

export const authRepository = new AuthRepository();
