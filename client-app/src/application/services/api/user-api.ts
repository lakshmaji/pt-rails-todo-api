import { AxiosResponse } from "axios";
import axiosInstance from "../../../lib/axiosInstance";
import { UserProfile } from "../../../domain/models/User";

class UserApi {
  async get(): Promise<AxiosResponse<UserProfile>> {
    return await axiosInstance.get<UserProfile>("/v1/me");
  }
}

export const userApiService = new UserApi();
