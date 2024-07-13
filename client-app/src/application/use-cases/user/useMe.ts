import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "../../../domain/models/User";
import { userRepository } from "../../services/repositories/user-repository";

export const useMe = () => {
  const { data } = useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: userRepository.me,
  });
  return { user: data };
};
