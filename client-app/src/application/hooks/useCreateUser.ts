import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateUserRequest, IUser } from "../../domain/models/User";
import { createUser } from "../use-cases/auth/createUser";

export const useCreateUser = () => {
  return useMutation<IUser, DefaultError, CreateUserRequest>({
    mutationFn: (payload) => createUser(payload),
    onSuccess: (newlyCreatedTask, variables) => {
      // What should we do ?
      // TODO: redirect to some page ?
    },
  });
};
