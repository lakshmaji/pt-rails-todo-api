import {
  DefaultError,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ITask, TaskStatus, TasksWithMeta } from "../../domain/models/Task";
import { getTasks } from "../use-cases/tasks/getTasks";
import { createTasks } from "../use-cases/tasks/createTask";

interface CreateTaskInput {
  title: string;
  description?: string;
}
export const useCreateTask = (page: number, status?: TaskStatus) => {
  const queryClient = useQueryClient();

  return useMutation<ITask, DefaultError, CreateTaskInput>({
    mutationFn: ({ title, description }) => createTasks(title, description),
    onSuccess: (newlyCreatedTask, variables) => {
      if (status === undefined || status === TaskStatus.TODO) {
        // On first page, then only shift the new task

        // Although it has performance benefits,
        // this needs to be replaced with invalidation
        if (page === 1) {
          queryClient.setQueryData(["tasks", page, status], (oldData: any) => {
            if (!oldData) {
              return {};
            }

            let newData = [];
            let newMeta = {
              ...oldData.meta,
              total_count: oldData.meta.total_count + 1,
            };
            if (oldData.meta.per_page <= oldData.data.length) {
              newData = [
                newlyCreatedTask,
                ...oldData.data.slice(0, oldData.data.length - 1),
              ];
              // as the old todo will be moved to next page
              newMeta["has_more"] = true;
            } else {
              newData = [newlyCreatedTask, ...oldData.data];
            }

            return {
              ...oldData,
              data: newData,
              meta: newMeta,
            };
          });
        } else {
          queryClient.setQueryData(["tasks", page, status], (oldData: any) => {
            if (!oldData) {
              return {};
            }

            return {
              ...oldData,
              meta: {
                ...oldData.meta,
                total_count: oldData.meta.total_count + 1,
              },
            };
          });
        }
      }
    },
  });
};
