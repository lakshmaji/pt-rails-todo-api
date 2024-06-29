import {
  ITask,
  TaskStatus,
  TasksWithMeta,
  UpdateTaskInput,
} from "../models/Task";

export interface ITaskRepository {
  getTasks(page: number, status?: TaskStatus): Promise<TasksWithMeta>;
  createTask(title: string, description?: string): Promise<ITask>;
  updateTask(id: string, input: UpdateTaskInput): Promise<ITask>;
  deleteTask(id: string): Promise<void>;
}
