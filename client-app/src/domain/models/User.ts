export interface IUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface CreateUserResponse {
  user: IUser;
  tokens: {
    refresh_token: string;
    access_token: string;
  };
}

export interface CreateUserRequest extends Omit<IUser, "id"> {
  password_confirmation: string;
}

export interface ClientAppLoginRequest {
  grant_type: "password";
  client_id: string;
  client_secret: string;
  email: string;
  password: string;
  // redirect_uri: string;
}

export interface LoginRequest
  extends Pick<ClientAppLoginRequest, "email" | "password"> {}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export interface ClientAppLogoutRequest {
  client_id: string;
  client_secret: string;
  token: string;
}

export interface LogoutResponse {
  message: string;
}

export interface UserProfile
  extends Pick<IUser, "first_name" | "last_name" | "email" | "id"> {}

export interface ClientAppRefreshTokenRequest {
  client_id: string;
  client_secret: string;
  refresh_token: string;
  grant_type: "refresh_token";
}
