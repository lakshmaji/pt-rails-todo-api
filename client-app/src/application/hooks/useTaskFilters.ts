import { TaskStatus } from "../../domain/models/Task";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";

export const useTaskFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter =
    (searchParams.get("statusFilter") as TaskStatus) ?? undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);

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
