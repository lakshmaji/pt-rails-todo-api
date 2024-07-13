import { DefaultError, useMutation } from "@tanstack/react-query";
import { LoginResponse } from "../../../domain/models/User";
import { authRepository } from "../../services/repositories/auth-repository";

export const useRefreshToken = () => {
  return useMutation<LoginResponse, DefaultError, string>({
    mutationFn: (t) => authRepository.refreshToken(t),
    onSuccess: (res, variables) => {
      // What should we do ?
      // if (res?.access_token) {
      //   login(res.access_token, res.refresh_token);
      // }
    },
  });
};
