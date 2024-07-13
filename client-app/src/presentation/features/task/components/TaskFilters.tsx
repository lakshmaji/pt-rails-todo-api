import { TaskStatus } from "../../../../domain/models/Task";
import { useTaskFilters } from "../../../../application/use-cases/task/useTaskFilters";

const STATUS_FILTERS = [
  {
    label: "All",
    value: undefined,
  },
  {
    label: "Todo",
    value: TaskStatus.TODO,
  },
  {
    label: "In Progress",
    value: TaskStatus.IN_PROGRESS,
  },
  {
    label: "Done",
    value: TaskStatus.COMPLETED,
  },
];

const TaskFilters = () => {
  const { statusFilter, resetSearchParams } = useTaskFilters();
  return (
    <section className="container mx-auto py-4">
      <div className="flex justify-center gap-5 rounded-md bg-white p-4 transition-all duration-700 dark:bg-slate-800">
        {STATUS_FILTERS.map((eachStatus, i) => {
          return (
            <button
              key={i}
              onClick={() =>
                resetSearchParams({
                  page: "1",
                  ...(eachStatus.value && { statusFilter: eachStatus.value }),
                })
              }
              type="button"
              className={`font-thin  pb-2 ${
                statusFilter === eachStatus.value
                  ? "text-blue-500 transition-all duration-700 hover:text-gray-400 dark:hover:text-slate-500 border-b-2 border-blue-500"
                  : "text-gray-400 transition-all duration-700 hover:text-blue-500 dark:text-slate-500 dark:hover:text-blue-500"
              }`}
            >
              {eachStatus.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default TaskFilters;
