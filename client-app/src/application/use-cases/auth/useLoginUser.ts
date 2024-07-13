import { DefaultError, useMutation } from "@tanstack/react-query";
import { LoginRequest, LoginResponse } from "../../../domain/models/User";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../../providers/AuthProvider";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authRepository } from "../../services/repositories/auth-repository";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";

export const useLoginUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { login } = useContext(AuthContext);

  const mutation = useMutation<LoginResponse, DefaultError, LoginRequest>({
    mutationFn: (payload) => authRepository.login(payload),
    onSuccess: (response) => {
      if (response?.access_token) {
        const created_at = new Date(response.created_at);
        created_at.setSeconds(response.expires_in);
        login(
          response.access_token,
          response.refresh_token,
          created_at.valueOf()
        );
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        navigate(from, { replace: true });
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {},
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    mutation.mutate(data);
  };

  return { register, onSubmit: handleSubmit(onSubmit), errors };
};
