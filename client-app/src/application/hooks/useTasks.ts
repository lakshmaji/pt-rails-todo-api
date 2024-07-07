import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TaskStatus, TasksWithMeta } from "../../domain/models/Task";
import { getTasks } from "../use-cases/tasks/getTasks";
import { useSearchParams } from "react-router-dom";
import { useTaskFilters } from "./useTaskFilters";

export const useTasks = () => {
  const { statusFilter, page, resetSearchParams, changeSearchParams } =
    useTaskFilters();

  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery<TasksWithMeta>({
      queryKey: ["tasks", page, statusFilter],
      queryFn: () => getTasks(page, statusFilter),
      placeholderData: keepPreviousData,
    });

  const goToPreviousPage = () => {
    changeSearchParams({
      page: Math.max(page - 1, 0).toString(),
    });
  };
  const goToNextPage = () => {
    if (!isPlaceholderData && data?.meta?.has_more) {
      changeSearchParams({
        page: (page + 1).toString(),
      });
    }
  };

  const updateFilter = (status?: TaskStatus) => {
    // whenever status filter change, reset page so that we wont get unintended results
    resetSearchParams({
      page: "1",
      ...(status && { statusFilter: status }),
    });
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
