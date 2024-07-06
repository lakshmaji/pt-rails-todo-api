import { DefaultError, useMutation } from "@tanstack/react-query";
import { CreateUserRequest, IUser } from "../../domain/models/User";
import { createUser } from "../use-cases/auth/createUser";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type SignupFormInputs = CreateUserRequest;

export const useCreateUser = () => {
  const { register, handleSubmit, getValues } = useForm<SignupFormInputs>();
  const navigate = useNavigate();

  const mutation = useMutation<IUser, DefaultError, CreateUserRequest>({
    mutationFn: (payload) => createUser(payload),
    onSuccess: () => {
      // What should we do ?
      // TODO: redirect to some page ?
    },
  });

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    const res = await mutation.mutateAsync(data);
    if (res?.id) {
      // assume success
      // TODO: make user login too if needed
      navigate("/login");
    }
  };
  const submitHandler = handleSubmit(onSubmit);
  return { register, onSubmit: submitHandler, getValues };
};
