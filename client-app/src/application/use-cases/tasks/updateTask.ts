import { ITask, UpdateTaskInput } from "../../../domain/models/Task";
import { taskRepository } from "../../services/repositories/task-repository";

export const updateTask = async (
  id: string,
  input: UpdateTaskInput
): Promise<ITask> => {
  return await taskRepository.updateTask(id, input);
};
