import { FC } from "react";
import { ITask, TaskStatus } from "../../../../domain/models/Task";
import { SparklesIcon, CheckIcon, PlayIcon } from "@heroicons/react/24/outline";
import { useUpdateTask } from "../../../../application/hooks/useUpdateTask";
import Spinner from "../../../common/Spinner";

interface Props {
  task: ITask;
  page: number;
  statusFilter?: TaskStatus;
}
const TaskStatusAction: FC<Props> = ({ task, page, statusFilter }) => {
  const mutation = useUpdateTask(page, statusFilter);

  const onClickUpdateTodo = (new_status: TaskStatus) => {
    const payload = {
      ...task,
      status: new_status,
    };
    mutation.mutate(payload);
  };
  const changeStatusToInprogress = () => {
    onClickUpdateTodo(TaskStatus.IN_PROGRESS);
  };
  const changeStatusToCompleted = () => {
    onClickUpdateTodo(TaskStatus.COMPLETED);
  };
  if (mutation.isPending) {
    return (
      <div className="py-[2px] me-3">
        <Spinner />
      </div>
    );
  }
  if (task.status === TaskStatus.TODO) {
    return (
      <button
        className="text-white bg-indigo-400 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-200 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-indigo-400 dark:hover:bg-indigo-300 dark:focus:ring-indigo-600"
        onClick={changeStatusToInprogress}
        aria-label="mark-in-progress"
      >
        <PlayIcon className="w-4 h-4 size-6 text-white-400" />
        <span className="sr-only">Mark in progress</span>
      </button>
    );
  }
  if (task.status === TaskStatus.IN_PROGRESS) {
    return (
      <button
        className="text-white bg-purple-400 hover:bg-purple-600 focus:ring-4 focus:outline-none focus:ring-purple-200 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-purple-400 dark:hover:bg-purple-300 dark:focus:ring-purple-600"
        onClick={changeStatusToCompleted}
        aria-label="mark-done"
      >
        <CheckIcon className="w-4 h-4 size-6 text-white-400" />
        <span className="sr-only">Mark as done</span>
      </button>
    );
  }

  return (
    <span className="text-white bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-green-400 dark:focus:ring-green-600">
      <SparklesIcon className="w-4 h-4 size-6 text-white-400" />
      <span className="sr-only">Completed</span>
    </span>
  );
};

export default TaskStatusAction;
