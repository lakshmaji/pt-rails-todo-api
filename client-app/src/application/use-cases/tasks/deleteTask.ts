import { taskRepository } from "../../services/repositories/task-repository";

export const deleteTask = async (id: string): Promise<void> => {
  return await taskRepository.deleteTask(id);
};
