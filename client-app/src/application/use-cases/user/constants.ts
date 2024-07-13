import * as z from "zod";

export const formSchema = z
  .object({
    first_name: z.string().min(3, {
      message: "First name must be min 3 chars",
    }),
    last_name: z.string().min(3, {
      message: "Last name is required",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string({ message: "You must specify a password" }).min(5, {
      message: "Password must have at least 5 characters",
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });
