import {
  ITask,
  TaskStatus,
  TasksWithMeta,
  UpdateTaskInput,
} from "../../../domain/models/Task";
import { ITaskRepository } from "../../../domain/repositories/task-repository";
import { taskApiService } from "../api/task-api";
import {
  transformApiPostToDomain,
  transformApiPostsToDomain,
} from "../transformers/task";

class TaskRepository implements ITaskRepository {
  async getTasks(page: number, status?: TaskStatus): Promise<TasksWithMeta> {
    // transformApiToDomain
    const result = await taskApiService.fetchTasks({
      page,
      ...(status && { status }),
    });
    return {
      data: transformApiPostsToDomain(result.data),
      meta: {
        has_more: page < result.data.meta.total_pages,
        total_count: result.data.meta.total_count,
        per_page: result.data.meta.per_page,
      },
    };
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

export const taskRepository = new TaskRepository();
