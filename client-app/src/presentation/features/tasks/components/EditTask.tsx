import { FC, useState } from "react";
import TaskForm, { TaskFormInputs } from "./TaskForm";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ITask,
  TaskStatus,
  toTaskStatus,
} from "../../../../domain/models/Task";
import { useUpdateTask } from "../../../../application/hooks/useUpdateTask";

interface Props {
  page: number;
  statusFilter?: TaskStatus;
  task: ITask;
}
const EditTask: FC<Props> = ({ task, page, statusFilter }) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<TaskFormInputs>({});

  const mutation = useUpdateTask(page, statusFilter);

  const onClickUpdateTodo: SubmitHandler<TaskFormInputs> = async (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      ...(data.task_status && { status: toTaskStatus(data.task_status) }),
    };
    const res = await mutation.mutateAsync({
      id: task.id,
      ...payload,
    });
    if (res?.id) {
      // assume success
      setOpen(false);
    }
  };
  const openAddTask = () => {
    if (task.id) {
      reset({
        title: task.title,
        description: task.description,
        task_status: task.status.toString(),
      });
    }
    setOpen(true);
  };

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
        watch={watch}
        errors={errors}
        onSubmit={onClickUpdateTodo}
        current_task_status={task}
        isValid={isValid}
        loading={mutation.isPending}
      />
    </>
  );
};

export default EditTask;
