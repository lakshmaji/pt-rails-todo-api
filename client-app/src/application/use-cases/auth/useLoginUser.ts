import { DefaultError, useMutation } from "@tanstack/react-query";
import { LoginRequest, LoginResponse } from "../../../domain/models/User";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../../providers/AuthProvider";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authRepository } from "../../services/repositories/auth-repository";

type SigninFormInputs = LoginRequest;

export const useLoginUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { login } = useContext(AuthContext);
  const mutation = useMutation<LoginResponse, DefaultError, LoginRequest>({
    mutationFn: (payload) => authRepository.login(payload),
    onSuccess: (newlyCreatedTask, variables) => {
      // What should we do ?
      // TODO: redirect to some page ?
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SigninFormInputs>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<SigninFormInputs> = async (data) => {
    const res = await mutation.mutateAsync(data);
    if (res?.access_token) {
      // assume success
      const created_at = new Date(res.created_at);
      created_at.setSeconds(res.expires_in);
      login(res.access_token, res.refresh_token, created_at.valueOf());
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    }
  };
  const submitHandler = handleSubmit(onSubmit);

  return { register, onSubmit: submitHandler };
};
