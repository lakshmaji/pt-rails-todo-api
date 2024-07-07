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
      if (typeof status !== "undefined") {
        // when specific status filter applied
        // the page and no records should be updated
        queryClient.setQueryData(
          ["tasks", page, status],
          (oldData: TasksWithMeta) => {
            const newData = oldData.data.filter((od) => {
              return od.id !== newlyUpdatedTask.id;
            });

            let newMeta = {
              ...oldData.meta,
              total_count: oldData.meta.total_count - 1,
              has_more:
                page <
                Math.ceil(
                  (oldData.meta.total_count - 1) / oldData.meta.per_page
                ),
            };

            return {
              ...oldData,
              data: newData,
              meta: newMeta,
            };
          }
        );
      }

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
