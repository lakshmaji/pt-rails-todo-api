import { DefaultError, useMutation } from "@tanstack/react-query";
import { LoginRequest, LoginResponse } from "../../domain/models/User";
import { signinUser } from "../use-cases/auth/signinUser";

export const useLoginUser = () => {
  return useMutation<LoginResponse, DefaultError, LoginRequest>({
    mutationFn: (payload) => signinUser(payload),
    onSuccess: (newlyCreatedTask, variables) => {
      // What should we do ?
      // TODO: redirect to some page ?
    },
  });
};
