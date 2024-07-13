import { DefaultError, useMutation } from "@tanstack/react-query";
import {
  CreateUserRequest,
  CreateUserResponse,
} from "../../../domain/models/User";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../../services/repositories/auth-repository";

type SignupFormInputs = CreateUserRequest;

export const useCreateUser = () => {
  const { register, handleSubmit, getValues } = useForm<SignupFormInputs>();
  const navigate = useNavigate();

  const mutation = useMutation<
    CreateUserResponse,
    DefaultError,
    CreateUserRequest
  >({
    mutationFn: (payload) => authRepository.createAccount(payload),
    onSuccess: () => {
      // What should we do ?
      // TODO: redirect to some page ?
    },
  });

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    const res = await mutation.mutateAsync(data);
    if (res.user?.id) {
      // assume success
      // TODO: make user login too if needed
      navigate("/login");
    }
  };
  const submitHandler = handleSubmit(onSubmit);
  return { register, onSubmit: submitHandler, getValues };
};
