import { ITask, toTaskStatus } from "../../../domain/models/Task";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TaskFormInputs } from "../../../presentation/features/task/components/TaskForm";
import { useUpdateTask } from "./useUpdateTask";
import { useTaskFilters } from "./useTaskFilters";

export const useEditTask = (task: ITask) => {
  const [open, setOpen] = useState(false);
  const { statusFilter: status, page } = useTaskFilters();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<TaskFormInputs>({});

  const mutation = useUpdateTask(page, status);

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

  return {
    open,
    openAddTask,
    setOpen,
    register,
    handleSubmit,
    errors,
    onClickUpdateTodo,
    isValid,
    isPending: mutation.isPending,
  };
};
