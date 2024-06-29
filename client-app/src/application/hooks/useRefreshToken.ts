import { DefaultError, useMutation } from "@tanstack/react-query";
import { LoginResponse } from "../../domain/models/User";
import { refreshUserToken } from "../use-cases/auth/refreshUserToken";

export const useRefreshToken = () => {
  return useMutation<LoginResponse, DefaultError, string>({
    mutationFn: (t) => refreshUserToken(t),
    onSuccess: (res, variables) => {
      // What should we do ?
      // if (res?.access_token) {
      //   login(res.access_token, res.refresh_token);
      // }
    },
  });
};
