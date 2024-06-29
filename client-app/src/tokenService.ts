// import axios from "axios";

import axiosInstance from "./lib/axiosInstance";

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const TokenService = {
  getAccessToken() {
    const value = sessionStorage.getItem(TOKEN_KEY);
    if (value === "null" || value === "undefined") {
      return null;
    }
    return value;
  },
  getRefreshToken() {
    const value = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (value === "null" || value === "undefined") {
      return null;
    }
    return value;
  },
  getExpiresAt() {
    const value = localStorage.getItem("expires_at");
    if (value === "null" || value === "undefined") {
      return null;
    }
    return value;
  },
  saveTokens(accessToken: string, refreshToken: string, expires_at: string) {
    sessionStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem("expires_at", expires_at?.valueOf());
    this.setAxiosHeaders(accessToken);
  },
  removeTokens() {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.setAxiosHeaders(null);
  },
  setAxiosHeaders(accessToken: string | null) {
    if (accessToken) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  },
  setupInterceptors(store: {
    logout: () => void;
    restoreAcessToken: (t: string) => void;
  }) {
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          if (error.response.status === 401) {
            // TODO: actually we can do refresh token
            // store.logout();
            store.restoreAcessToken(this.getRefreshToken() as string);
          } else if (error.response.status === 400) {
            if (error.response.data?.error === "invalid_grant") {
              // Invalid refresh token
              store.logout();
            }
          }
        }
        return Promise.reject(error);
      }
    );
  },
};

export default TokenService;
