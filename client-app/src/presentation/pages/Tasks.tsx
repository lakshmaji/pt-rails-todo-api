import { useTasks } from "../../application/hooks/useTasks";
import TaskItem from "../features/tasks/components/TaskItem";
import TaskFilters from "../features/tasks/components/TaskFilters";
import Paginate from "../features/tasks/components/Paginate";
import AddTask from "../features/tasks/components/AddTask";
import Spinner from "../common/Spinner";

const Tasks = () => {
  const {
    isPending,
    isError,
    error,
    tasks,
    isFetching,
    goToNextPage,
    goToPreviousPage,
    updateFilter,
    statusFilter,
    page,
    prevPageDisabled,
    nextPageDisabled,
    total_records,
    per_page,
  } = useTasks();

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error?.message}</div>;
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
        {tasks.map((task) => (
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
        prevPageDisabled={prevPageDisabled}
        nextPageDisabled={nextPageDisabled}
        page={page}
        count={total_records}
        per_page={per_page}
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
