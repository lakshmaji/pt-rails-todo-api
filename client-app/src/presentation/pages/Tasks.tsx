import { useTasks } from "../../application/use-cases/task/useTasks";
import TaskItem from "../features/task/components/TaskItem";
import TaskFilters from "../features/task/components/TaskFilters";
import Paginate from "../features/task/components/Paginate";
import AddTask from "../features/task/components/AddTask";
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
      <AddTask />
      <TaskFilters />
      <div
        className="rounded-t-md bg-white transition-all duration-700 dark:bg-slate-800"
        data-testid="todo-list"
        role="list"
      >
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
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
