import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ITask, TaskStatus } from "../../../domain/models/Task";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useTaskFilters } from "./useTaskFilters";
import { taskRepository } from "../../services/repositories/task-repository";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { z } from "zod";

interface CreateTaskInput {
  title: string;
  description?: string;
}
export const useCreateTask = () => {
  const [open, setOpen] = useState(false);
  const { statusFilter: status, page } = useTaskFilters();

  const openAddTask = () => {
    setOpen(true);
  };

  const modalsetOpen = (value: boolean) => {
    setOpen(value);
    reset();
  };

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation<ITask, DefaultError, CreateTaskInput>({
    mutationFn: ({ title, description }) =>
      taskRepository.createTask(title, description),
    onSuccess: (newlyCreatedTask, variables) => {
      if (status === undefined || status === TaskStatus.TODO) {
        // On first page, then only shift the new task

        // Although it has performance benefits,
        // this needs to be replaced with invalidation
        if (page === 1) {
          queryClient.setQueryData(["tasks", page, status], (oldData: any) => {
            if (!oldData) {
              return {};
            }

            let newData = [];
            let newMeta = {
              ...oldData.meta,
              total_count: oldData.meta.total_count + 1,
            };
            if (oldData.meta.per_page <= oldData.data.length) {
              newData = [
                newlyCreatedTask,
                ...oldData.data.slice(0, oldData.data.length - 1),
              ];
              // as the old todo will be moved to next page
              newMeta["has_more"] = true;
            } else {
              newData = [newlyCreatedTask, ...oldData.data];
            }

            return {
              ...oldData,
              data: newData,
              meta: newMeta,
            };
          });
        } else {
          queryClient.setQueryData(["tasks", page, status], (oldData: any) => {
            if (!oldData) {
              return {};
            }

            return {
              ...oldData,
              meta: {
                ...oldData.meta,
                total_count: oldData.meta.total_count + 1,
              },
            };
          });
        }
      }
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    const res = await mutation.mutateAsync(data);
    if (res?.id) {
      // assume success
      reset();
      setOpen(false);
    }
  };

  return {
    register,
    onClickAddTodo: onSubmit,
    handleSubmit,
    reset,
    errors,
    isValid,
    isPending: mutation.isPending,
    openAddTask,
    open,
    modalsetOpen,
  };
};
