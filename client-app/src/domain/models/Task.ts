export enum TaskStatus {
  TODO = "todo",
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  status_human_readable: string;
}

export interface ServerTask {
  id: string;
  type: "task";
  attributes: {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    status_human_readable: string;
  };
}

export interface TaskResponse {
  data: Array<ServerTask>;
  // FIXME:
  meta: any;
}

export interface TasksWithMeta {
  data: ITask[];
  meta: { has_more: boolean; total_count: number; per_page: number };
}

export interface CreateTaskResponse {
  data: ServerTask;
}

export interface UpdateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export function toTaskStatus(status: string): TaskStatus | undefined {
  switch (status) {
    case TaskStatus.TODO:
      return TaskStatus.TODO;
    case TaskStatus.COMPLETED:
      return TaskStatus.COMPLETED;
    case TaskStatus.IN_PROGRESS:
      return TaskStatus.IN_PROGRESS;
    default:
      return undefined;
  }
}
