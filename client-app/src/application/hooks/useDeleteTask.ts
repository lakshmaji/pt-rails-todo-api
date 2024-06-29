import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { TaskStatus } from "../../domain/models/Task";
import { deleteTask } from "../use-cases/tasks/deleteTask";

export const useDeleteTask = (page: number, status?: TaskStatus) => {
  const queryClient = useQueryClient();

  return useMutation<void, DefaultError, string>({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", page, status],
      });
    },
  });
};
