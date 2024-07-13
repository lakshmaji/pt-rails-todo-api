import { TaskStatus } from "../../../../domain/models/Task";

export const TASK_STATUS_OPTIONS = [
  {
    label: "Todo",
    value: TaskStatus.TODO,
    id: "status-todo-ref-id",
    description: "This is the default status for every new task created.",
  },
  {
    label: "In Progress",
    value: TaskStatus.IN_PROGRESS,
    id: "status-in-progress-ref-id",
    description: "When task is in progress or started",
  },
  {
    label: "Done",
    value: TaskStatus.COMPLETED,
    id: "status-done-ref-id",
    description: "When task is completed or finished",
  },
];

export const TaskStatusColors = {
  [TaskStatus.COMPLETED]: {
    c: "bg-green-100 text-green-700",
    i: "fill-green-500",
  },
  [TaskStatus.TODO]: {
    c: "bg-indigo-100 text-indigo-700",
    i: "fill-indigo-500",
  },
  [TaskStatus.IN_PROGRESS]: {
    c: "bg-purple-100 text-purple-700",
    i: "fill-purple-500",
  },
};
