import * as z from "zod";

export const formSchema = z.object({
  email: z.string().email({ message: "Provide email address" }),
  password: z.string().min(1, { message: "You must specify a password" }),
});
