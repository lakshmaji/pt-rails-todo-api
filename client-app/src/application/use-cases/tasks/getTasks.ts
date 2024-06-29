import { TaskStatus, TasksWithMeta } from "../../../domain/models/Task";
import { taskRepository } from "../../services/repositories/task-repository";

export const getTasks = async (
  page: number,
  status?: TaskStatus
): Promise<TasksWithMeta> => {
  return await taskRepository.getTasks(page, status);
};
