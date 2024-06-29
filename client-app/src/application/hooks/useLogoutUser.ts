import { DefaultError, useMutation } from "@tanstack/react-query";
import { LogoutResponse } from "../../domain/models/User";
import { signoutUser } from "../use-cases/auth/signoutUser";
import { useAuth } from "./useAuth";

export const useLogoutUser = () => {
  const { auth, logout } = useAuth();

  return useMutation<LogoutResponse, DefaultError>({
    mutationFn: () => signoutUser(auth.accessToken),
    onSuccess: (newlyCreatedTask, variables) => {
      // TODO: incase of failure, do not clear
      // if (newlyCreatedTask.message) {
      logout();
      // }
    },
  });
};
