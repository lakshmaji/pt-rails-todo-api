import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TaskStatus, TasksWithMeta } from "../../domain/models/Task";
import { getTasks } from "../use-cases/tasks/getTasks";
import { useState } from "react";

export const useTasks = () => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus>();
  const [page, setPage] = useState(1);
  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery<TasksWithMeta>({
      queryKey: ["tasks", page, statusFilter],
      queryFn: () => getTasks(page, statusFilter),
      placeholderData: keepPreviousData,
    });

  const goToPreviousPage = () => setPage((old) => Math.max(old - 1, 0));
  const goToNextPage = () => {
    if (!isPlaceholderData && data?.meta?.has_more) {
      setPage((old) => old + 1);
    }
  };

  const updateFilter = (status?: TaskStatus) => {
    // whenever status filter change, reset page so that we wont get unintended results
    setPage(1);
    setStatusFilter(status);
  };

  return {
    isPending,
    isError,
    error,
    data,
    isFetching,
    tasks: data?.data || [],
    goToPreviousPage,
    goToNextPage,
    updateFilter,
    statusFilter,
    page,
    prevPageDisabled: page === 1,
    nextPageDisabled: isPlaceholderData || !data?.meta?.has_more,
    total_records: data?.meta?.total_count || 0,
    per_page: data?.meta?.per_page || 0,
  };
};
