import { FC } from "react";
import TaskForm from "./TaskForm";
import { useCreateTask } from "../../../../application/hooks/useCreateTask";
import { TaskStatus } from "../../../../domain/models/Task";
import { useMe } from "../../../../application/hooks/useMe";
interface Props {
  page: number;
  statusFilter?: TaskStatus;
}
const AddTask: FC<Props> = ({ page, statusFilter }) => {
  const {
    register,
    onClickAddTodo,
    handleSubmit,
    openAddTask,
    errors,
    isPending,
    isValid,
    open,
    modalsetOpen,
  } = useCreateTask(page, statusFilter);

  const { user } = useMe();

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <span className="font-extralight pr-1 text-sm">Hi</span>
          <span className="truncate text-base font-medium leading-7 text-slate-900">
            {user?.first_name},
          </span>
        </div>
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={openAddTask}
          disabled={open}
        >
          Add Todo
        </button>
      </div>
      <TaskForm
        open={open}
        setOpen={modalsetOpen}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onClickAddTodo}
        isValid={isValid}
        loading={isPending}
      />
    </>
  );
};

export default AddTask;
