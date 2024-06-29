import { AxiosResponse } from "axios";
import { CreateTaskResponse, TaskResponse } from "../../../domain/models/Task";
import axiosInstance from "../../../lib/axiosInstance";

class TaskApi {
  async fetchTasks(params: any): Promise<AxiosResponse<TaskResponse>> {
    return await axiosInstance.get<TaskResponse>("/v1/tasks", {
      params,
    });
  }

  async createTask(payload: any): Promise<AxiosResponse<CreateTaskResponse>> {
    return await axiosInstance.post<CreateTaskResponse>("/v1/tasks", payload);
  }

  async updateTask(
    id: string,
    payload: any
  ): Promise<AxiosResponse<CreateTaskResponse>> {
    return await axiosInstance.put<CreateTaskResponse>(
      `/v1/tasks/${id}`,
      payload
    );
  }
  async deleteTask(id: string): Promise<void> {
    return await axiosInstance.delete(`/v1/tasks/${id}`);
  }
}

export const taskApiService = new TaskApi();
