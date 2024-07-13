import * as z from "zod";
import { TaskStatus } from "../../../domain/models/Task";

export const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  task_status: z.nativeEnum(TaskStatus).optional(),
});
