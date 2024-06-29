import { FC } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { ITask } from "../../../../domain/models/Task";
import clsx from "clsx";
import { TASK_STATUS_OPTIONS } from "./constants";

export type TaskFormInputs = {
  title: string;
  description: string;
  task_status: string;
};

interface Props {
  open: boolean;
  setOpen(value: boolean): void;
  register: UseFormRegister<TaskFormInputs>;
  handleSubmit: UseFormHandleSubmit<TaskFormInputs>;
  watch: UseFormWatch<TaskFormInputs>;
  errors: FieldErrors<TaskFormInputs>;
  onSubmit: SubmitHandler<TaskFormInputs>;
  current_task_status?: ITask;
  isValid: boolean;
  loading: boolean;
}
const TaskForm: FC<Props> = ({
  open,
  setOpen,
  register,
  handleSubmit,
  watch,
  errors,
  onSubmit,
  current_task_status,
  isValid,
  loading,
}) => {
  return (
    <Dialog className="relative z-10" open={open} onClose={setOpen}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity "
      />
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <form
                className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl dark:bg-slate-800"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="h-0 flex-1 overflow-y-auto">
                  <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-base font-semibold leading-6 text-white">
                        {current_task_status?.id ? "Edit Todo" : "New Todo"}
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1">
                      <p
                        className="text-sm text-indigo-300"
                        id="todo-form-description"
                      >
                        Get started by filling in the information below to{" "}
                        {current_task_status?.id ? "update" : "create"} your
                        todo.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="divide-y divide-gray-200 px-4 sm:px-6">
                      <div className="space-y-6 pb-5 pt-6">
                        <div>
                          <label
                            htmlFor="todo-title"
                            className={clsx(
                              "block text-sm font-medium leading-6 text-gray-900 dark:text-slate-400",
                              errors.title && "text-red-700 dark:text-red-500"
                            )}
                          >
                            Task title
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              id="todo-title"
                              className={clsx(
                                "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  dark:bg-slate-800 dark:text-slate-400 dark:placeholder:text-slate-500",

                                errors.title &&
                                  "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                              )}
                              {...register("title", {
                                required: {
                                  value: true,
                                  message: "Title is required",
                                },
                              })}
                            />
                          </div>
                          {errors.title && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-600">
                              {errors.title.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="todo-description"
                            className="block text-sm font-medium leading-6 text-gray-900  dark:text-slate-400"
                          >
                            Task description
                          </label>
                          <div className="mt-2">
                            <textarea
                              id="todo-description"
                              rows={4}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-slate-400 dark:placeholder:text-slate-500"
                              defaultValue={""}
                              {...register("description")}
                            />
                          </div>
                        </div>

                        <fieldset
                          className={clsx(
                            current_task_status?.id ? "visible" : "invisible"
                          )}
                        >
                          <legend
                            className="text-sm font-medium leading-6 text-gray-900  dark:text-slate-400"
                            id="todo-status"
                          ></legend>
                          <div className="mt-2 space-y-4">
                            {TASK_STATUS_OPTIONS.map((tsOption) => {
                              return (
                                <div
                                  key={tsOption.id + current_task_status}
                                  className="relative flex items-start"
                                >
                                  <div className="absolute flex h-6 items-center">
                                    <input
                                      id={`status-${
                                        tsOption.id + current_task_status
                                      }-label`}
                                      aria-describedby={`status-${
                                        tsOption.id + current_task_status
                                      }-description`}
                                      {...register("task_status")}
                                      type="radio"
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                      defaultChecked={
                                        tsOption.value ===
                                        current_task_status?.status
                                      }
                                      value={tsOption.value}
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor={`status-${
                                        tsOption.id + current_task_status
                                      }-label`}
                                      className="font-medium text-gray-900  dark:text-slate-500"
                                    >
                                      {tsOption.label}
                                    </label>
                                    <p
                                      id={`status-${
                                        tsOption.id + current_task_status
                                      }-description`}
                                      className="text-gray-500"
                                    >
                                      {tsOption.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-shrink-0 justify-end px-4 py-4">
                  <button
                    type="button"
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={clsx(
                      "ml-4 inline-flex justify-center items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                      !isValid && "cursor-not-allowed"
                    )}
                    disabled={loading}
                  >
                    {loading && (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    {current_task_status?.id ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TaskForm;
