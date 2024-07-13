import { DefaultError, useMutation } from "@tanstack/react-query";
import { LogoutResponse } from "../../../domain/models/User";
import { useAuth } from "../../hooks/useAuth";
import { authRepository } from "../../services/repositories/auth-repository";

export const useLogoutUser = () => {
  const { auth, logout } = useAuth();

  const mutation = useMutation<LogoutResponse, DefaultError>({
    mutationFn: () => authRepository.logout(auth.accessToken),
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
