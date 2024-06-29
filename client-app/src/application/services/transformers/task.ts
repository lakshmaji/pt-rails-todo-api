import { ITask, ServerTask, TaskResponse } from "../../../domain/models/Task";

export const transformApiPostToDomain = (apiPost: ServerTask): ITask => {
  return {
    id: apiPost.id.toString(),
    title: apiPost.attributes.title,
    description: apiPost.attributes.description,
    status: apiPost.attributes.status,
    status_human_readable: apiPost.attributes.status_human_readable,
  } as unknown as ITask; // FIXME: this typecast
};

export const transformApiPostsToDomain = (apiPosts: TaskResponse): ITask[] => {
  return apiPosts.data.map(transformApiPostToDomain);
};
