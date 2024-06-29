import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TaskStatus, TasksWithMeta } from "../../domain/models/Task";
import { getTasks } from "../use-cases/tasks/getTasks";

export const useTasks = (page: number, status?: TaskStatus) => {
  return useQuery<TasksWithMeta>({
    queryKey: ["tasks", page, status],
    queryFn: () => getTasks(page, status),
    placeholderData: keepPreviousData,
  });
};
