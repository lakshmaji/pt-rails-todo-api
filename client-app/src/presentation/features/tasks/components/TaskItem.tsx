import { useDeleteTask } from "../../../../application/hooks/useDeleteTask";
import { ITask, TaskStatus } from "../../../../domain/models/Task";
import EditTask from "./EditTask";
import { TrashIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import TaskStatusAction from "./TaskStatusAction";
import { useDeleteConfirmation } from "../../../../application/hooks/useDeleteConfirmation";
import DeleteConfirmDialog from "../../../common/DeleteConfirmDialog";
import { TaskStatusColors } from "./constants";

interface Props {
  task: ITask;
  page: number;
  statusFilter?: TaskStatus;
}

const TaskItem: React.FC<Props> = ({ task, page, statusFilter }) => {
  // TODO: move this to a helper or domain logic
  const completed = task.status === TaskStatus.COMPLETED;
  const mutation = useDeleteTask(page, statusFilter);

  const deleteConfirmation = useDeleteConfirmation({
    title: `Delete ${task.title}`,
    description: `Are you sure you want to delete ${task.title}? This will be permanently removed. This action cannot be undone.`,
    onConfirm: async () => {
      await mutation.mutateAsync(task.id);
    },
  });

  return (
    <div
      className="flex gap-4 border-b border-gray-200 p-4 dark:border-slate-500 items-center"
      data-testid="todo-item"
      role="listitem"
    >
      {/* TODO: toggle todo and in progress icons and actions here */}
      <TaskStatusAction task={task} page={page} statusFilter={statusFilter} />
      <p
        className={`grow ${
          completed
            ? "text-gray-300 line-through transition-all duration-700 dark:text-slate-500"
            : "text-gray-500 transition-all duration-700 dark:text-slate-400"
        }`}
      >
        {task.title}
      </p>

      <span
        className={clsx(
          "inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 px-2 py-[2px] text-xs font-medium text-blue-700 capitalize",
          TaskStatusColors[task.status].c
        )}
        data-testid="todo-status"
      >
        <svg
          className={clsx(
            "h-1.5 w-1.5 fill-blue-500",
            TaskStatusColors[task.status].i
          )}
          viewBox="0 0 6 6"
          aria-hidden="true"
        >
          <circle cx={3} cy={3} r={3} />
        </svg>
        {task.status_human_readable}
      </span>

      <EditTask task={task} page={page} statusFilter={statusFilter} />
      <button onClick={deleteConfirmation.openDialog} data-testid="delete-btn">
        <TrashIcon className="size-6 text-gray-500" />
      </button>
      <DeleteConfirmDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={deleteConfirmation.closeDialog}
        onConfirm={deleteConfirmation.handleConfirm}
        title={deleteConfirmation.title}
        description={deleteConfirmation.description}
      />
    </div>
  );
};
export default TaskItem;
