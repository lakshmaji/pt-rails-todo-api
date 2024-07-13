import { DefaultError, useMutation } from "@tanstack/react-query";
import {
  CreateUserRequest,
  CreateUserResponse,
} from "../../../domain/models/User";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../../services/repositories/auth-repository";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { toast } from "react-toastify";

export const useCreateUser = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const navigate = useNavigate();

  const mutation = useMutation<
    CreateUserResponse,
    DefaultError,
    CreateUserRequest
  >({
    mutationFn: (payload) => authRepository.createAccount(payload),
    onSuccess: (response) => {
      if (response.user?.id) {
        toast.success("Success");
        navigate("/login");
      }
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    mutation.mutate(data);
  };

  return { register, onSubmit: handleSubmit(onSubmit), errors };
};
