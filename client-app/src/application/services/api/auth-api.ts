import { AxiosResponse } from "axios";
import axiosInstance from "../../../lib/axiosInstance";
import {
  ClientAppLoginRequest,
  ClientAppLogoutRequest,
  ClientAppRefreshTokenRequest,
  CreateUserResponse,
  LoginResponse,
  LogoutResponse,
} from "../../../domain/models/User";

class AuthApi {
  async createAccount(
    payload: any
  ): Promise<AxiosResponse<CreateUserResponse>> {
    return await axiosInstance.post<CreateUserResponse>(
      "/v1/auth/signup",
      payload
    );
  }
  async login(
    payload: ClientAppLoginRequest
  ): Promise<AxiosResponse<LoginResponse>> {
    return await axiosInstance.post<LoginResponse>("/oauth/token", payload);
  }

  async logout(
    payload: ClientAppLogoutRequest
  ): Promise<AxiosResponse<LogoutResponse>> {
    return await axiosInstance.post<LogoutResponse>("/oauth/revoke", payload);
  }

  async refreshToken(
    payload: ClientAppRefreshTokenRequest
  ): Promise<AxiosResponse<LoginResponse>> {
    return await axiosInstance.post<LoginResponse>("/oauth/token", payload);
  }
}

export const authApiService = new AuthApi();
