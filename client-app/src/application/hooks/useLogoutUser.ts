import { DefaultError, useMutation } from "@tanstack/react-query";
import { LogoutResponse } from "../../domain/models/User";
import { signoutUser } from "../use-cases/auth/signoutUser";
import { useAuth } from "./useAuth";

export const useLogoutUser = () => {
  const { auth, logout } = useAuth();

  const mutation = useMutation<LogoutResponse, DefaultError>({
    mutationFn: () => signoutUser(auth.accessToken),
    onSuccess: (response, variables) => {
      // TODO: incase of failure, do not clear
      // if (response.message) {
      logout();
      // }
    },
  });

  const onClickLogout = async () => {
    await mutation.mutate();
  };

  return { onClickLogout };
};
