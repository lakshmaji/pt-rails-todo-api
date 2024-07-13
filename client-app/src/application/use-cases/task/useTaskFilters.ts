import { toTaskStatus } from "../../../domain/models/Task";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";

const toPage = (page: string | null): number => {
  // handles NaN
  return parseInt(page || "1", 10) ?? 1;
};

export const useTaskFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = toTaskStatus(searchParams.get("statusFilter"));
  const page = toPage(searchParams.get("page"));

  const changeSearchParams = <T extends Record<string, string>>(props: T) => {
    setSearchParams({
      // persist previous filter
      ...Object.fromEntries(searchParams.entries()),
      ...props,
    });
  };

  const resetSearchParams = (props: URLSearchParamsInit) => {
    setSearchParams(props);
  };

  return {
    statusFilter,
    page,
    changeSearchParams,
    resetSearchParams,
  };
};
