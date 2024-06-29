import { ITask } from "../../../domain/models/Task";
import { taskRepository } from "../../services/repositories/task-repository";

export const createTasks = async (
  title: string,
  description?: string
): Promise<ITask> => {
  return await taskRepository.createTask(title, description);
};
