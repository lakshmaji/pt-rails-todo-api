import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "../../domain/models/User";
import { getMe } from "../use-cases/auth/getMe";

export const useMe = () => {
  const { data } = useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: getMe,
  });
  return { user: data };
};
