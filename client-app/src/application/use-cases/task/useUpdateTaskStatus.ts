import { ITask, TaskStatus } from "../../../domain/models/Task";
import { useUpdateTask } from "./useUpdateTask";

export const useUpdateTaskStatus = (
  task: ITask,
  page: number,
  status?: TaskStatus
) => {
  const mutation = useUpdateTask(page, status);

  const onClickUpdateTodo = (new_status: TaskStatus) => {
    const payload = {
      ...task,
      status: new_status,
    };
    mutation.mutate(payload);
  };
  const changeStatusToInprogress = () => {
    onClickUpdateTodo(TaskStatus.IN_PROGRESS);
  };
  const changeStatusToCompleted = () => {
    onClickUpdateTodo(TaskStatus.COMPLETED);
  };

  return {
    isPending: mutation.isPending,
    changeStatusToInprogress,
    changeStatusToCompleted,
  };
};
