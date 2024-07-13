import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTaskFilters } from "./useTaskFilters";
import { taskRepository } from "../../services/repositories/task-repository";

export const useDeleteTask = (id: string) => {
  const { statusFilter: status, page } = useTaskFilters();
  const queryClient = useQueryClient();

  const mutation = useMutation<void, DefaultError, string>({
    mutationFn: taskRepository.deleteTask,
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
