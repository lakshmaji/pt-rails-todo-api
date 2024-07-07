import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteTask } from "../use-cases/tasks/deleteTask";
import { useTaskFilters } from "./useTaskFilters";

export const useDeleteTask = (id: string) => {
  const { statusFilter: status, page } = useTaskFilters();
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
