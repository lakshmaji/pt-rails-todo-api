import { FC, useState } from "react";
import TaskForm, { TaskFormInputs } from "./TaskForm";
import { useCreateTask } from "../../../../application/hooks/useCreateTask";
import { SubmitHandler, useForm } from "react-hook-form";
import { TaskStatus } from "../../../../domain/models/Task";
import { useMe } from "../../../../application/hooks/useMe";
interface Props {
  page: number;
  statusFilter?: TaskStatus;
}
const AddTask: FC<Props> = ({ page, statusFilter }) => {
  const [open, setOpen] = useState(false);

  const openAddTask = () => {
    setOpen(true);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<TaskFormInputs>();

  const mutation = useCreateTask(page, statusFilter);
  const { data: user } = useMe();
  const onClickAddTodo: SubmitHandler<TaskFormInputs> = async (data) => {
    const res = await mutation.mutateAsync(data);
    if (res?.id) {
      // assume success
      setOpen(false);
      reset();
    }
  };
  const modalsetOpen = (value: boolean) => {
    setOpen(value);
    reset();
  };

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
        watch={watch}
        errors={errors}
        onSubmit={onClickAddTodo}
        isValid={isValid}
        loading={mutation.isPending}
      />
    </>
  );
};

export default AddTask;
