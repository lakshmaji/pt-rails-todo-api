import { FC } from "react";
import TaskForm from "./TaskForm";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ITask } from "../../../../domain/models/Task";
import { useEditTask } from "../../../../application/use-cases/task/useEditTask";

interface Props {
  task: ITask;
}
const EditTask: FC<Props> = ({ task }) => {
  const {
    open,
    openAddTask,
    setOpen,
    register,
    handleSubmit,
    errors,
    isValid,
    isPending,
    onClickUpdateTodo,
  } = useEditTask(task);

  return (
    <>
      <button
        type="button"
        onClick={openAddTask}
        disabled={open}
        data-testid="edit-btn"
      >
        <PencilSquareIcon className="size-6 text-gray-500" />
      </button>

      <TaskForm
        open={open}
        setOpen={setOpen}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onClickUpdateTodo}
        current_task_status={task}
        isValid={isValid}
        loading={isPending}
      />
    </>
  );
};

export default EditTask;
