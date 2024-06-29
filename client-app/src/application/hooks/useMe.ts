import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "../../domain/models/User";
import { getMe } from "../use-cases/auth/getMe";

export const useMe = () => {
  return useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: getMe,
  });
};
