import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ITask,
  TaskStatus,
  TasksWithMeta,
  UpdateTaskInput,
} from "../../domain/models/Task";
import { updateTask } from "../use-cases/tasks/updateTask";

interface UpdateTaskVars extends UpdateTaskInput {
  id: string;
}
export const useUpdateTask = (page: number, status?: TaskStatus) => {
  const queryClient = useQueryClient();

  return useMutation<ITask, DefaultError, UpdateTaskVars>({
    mutationFn: ({ id, ...params }) => updateTask(id, params),
    onSuccess: (newlyUpdatedTask, variables) => {
      queryClient.setQueryData(
        ["tasks", page, status],
        (oldData: TasksWithMeta) => {
          if (!oldData) {
            return {};
          }

          // TODO: This has to update the meta, to refelect the changes from filter
          const newData = oldData.data.map((od) => {
            if (od.id === newlyUpdatedTask.id) {
              return newlyUpdatedTask;
            }
            return od;
          });

          return {
            ...oldData,
            data: newData,
          };
        }
      );
    },
  });
};
