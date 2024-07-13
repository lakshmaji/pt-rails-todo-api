import { ITask, UpdateTaskInput } from "../../../domain/models/Task";
import { UserProfile } from "../../../domain/models/User";
import { IUserRepository } from "../../../domain/repositories/user-repository";
import { taskApiService } from "../api/task-api";
import { userApiService } from "../api/user-api";
import { transformApiPostToDomain } from "../transformers/task";

class UserRepository implements IUserRepository {
  async me(): Promise<UserProfile> {
    const result = await userApiService.get();
    return result.data;
  }

  async createTask(title: string, description?: string): Promise<ITask> {
    const result = await taskApiService.createTask({
      title,
      description,
    });
    return transformApiPostToDomain(result.data.data);
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<ITask> {
    const result = await taskApiService.updateTask(id, input);
    return transformApiPostToDomain(result.data.data);
  }

  async deleteTask(id: string): Promise<void> {
    await taskApiService.deleteTask(id);
  }
}

export const userRepository = new UserRepository();
