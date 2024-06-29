import { UserProfile } from "../models/User";

export interface IUserRepository {
  me(): Promise<UserProfile>;
}
