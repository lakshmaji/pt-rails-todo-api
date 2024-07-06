import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { TaskStatus } from "../../domain/models/Task";
import { deleteTask } from "../use-cases/tasks/deleteTask";

export const useDeleteTask = (
  id: string,
  page: number,
  status?: TaskStatus
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, DefaultError, string>({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", page, status],
      });
    },
  });

  const removeTask = async () => {
    await mutation.mutateAsync(id);
  };

  return removeTask;
};
