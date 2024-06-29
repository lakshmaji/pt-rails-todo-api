import { UserProfile } from "../../../domain/models/User";
import { userRepository } from "../../services/repositories/user-repository";

export const getMe = async (): Promise<UserProfile> => {
  return await userRepository.me();
};
