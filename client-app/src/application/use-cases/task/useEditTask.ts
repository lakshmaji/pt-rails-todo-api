import { ITask, toTaskStatus } from "../../../domain/models/Task";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateTask } from "./useUpdateTask";
import { useTaskFilters } from "./useTaskFilters";
import { formSchema } from "./constants";
import { z } from "zod";

export const useEditTask = (task: ITask) => {
  const [open, setOpen] = useState(false);
  const { statusFilter: status, page } = useTaskFilters();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<z.infer<typeof formSchema>>({});

  const mutation = useUpdateTask(page, status);

  const onClickUpdateTodo: SubmitHandler<z.infer<typeof formSchema>> = async (
    data
  ) => {
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
        task_status: task.status,
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
