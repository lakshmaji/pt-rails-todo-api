import React, { useState } from "react";
import { useTasks } from "../../application/hooks/useTasks";
import TaskItem from "../features/tasks/components/TaskItem";
import TaskFilters from "../features/tasks/components/TaskFilters";
import Paginate from "../features/tasks/components/Paginate";
import AddTask from "../features/tasks/components/AddTask";
import { TaskStatus } from "../../domain/models/Task";
import Spinner from "../common/Spinner";

const Tasks = () => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus>();
  const [page, setPage] = React.useState(1);

  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useTasks(page, statusFilter);

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
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <AddTask page={page} statusFilter={statusFilter} />
      <TaskFilters statusFilter={statusFilter} updateFilter={updateFilter} />
      <div
        className="rounded-t-md bg-white transition-all duration-700 dark:bg-slate-800"
        data-testid="todo-list"
        role="list"
      >
        {data.data?.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            page={page}
            statusFilter={statusFilter}
          />
        ))}
      </div>
      <Paginate
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        prevPageDisabled={page === 1}
        nextPageDisabled={isPlaceholderData || !data.meta?.has_more}
        page={page}
        count={data.meta.total_count}
        per_page={data.meta.per_page}
      />
      {isFetching ? (
        <div
          className="flex justify-center pt-2"
          data-testid="task-fetch-spinner"
        >
          <Spinner />
        </div>
      ) : null}
    </>
  );
};

export default Tasks;
