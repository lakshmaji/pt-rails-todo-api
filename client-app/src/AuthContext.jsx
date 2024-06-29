import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import TokenService from "./tokenService";
import { useRefreshToken } from "./application/hooks/useRefreshToken";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: null,
    refreshToken: null,
    isLoggedIn: false,
    state: "PENDING",
  });

  const {
    mutateAsync: callRefreshTokenAPI,
    status: loadingRefreshToken,
    ...rest
  } = useRefreshToken();

  const restoreAcessToken = useCallback(
    async (oldRefreshToken) => {
      try {
        const res = await callRefreshTokenAPI(oldRefreshToken);
        if (res?.access_token) {
          // assume success
          const created_at = new Date(res.created_at);
          created_at.setSeconds(res.expires_in);
          login(res.access_token, res.refresh_token, created_at);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    },
    [callRefreshTokenAPI]
  );

  useEffect(() => {
    const accessToken = TokenService.getAccessToken();
    const refreshToken = TokenService.getRefreshToken();
    const expiresAt = TokenService.getExpiresAt();

    // if (refreshToken) {
    // TokenService.setAxiosHeaders(accessToken);
    // FIXME: remove setTimeout
    // setTimeout(() => {
    const hasAccessToken = accessToken;
    if (accessToken && refreshToken && auth.state !== "READY") {
      // setAuth({
      //   accessToken,
      //   refreshToken,
      //   // assuming already logged in due to presense of access token
      //   isLoggedIn: true,
      //   state: "READY",
      // });
      login(accessToken, refreshToken, expiresAt);
    } else if (refreshToken === null && auth.state !== "READY") {
      // setAuth({
      //   accessToken,
      //   refreshToken,
      //   isLoggedIn: false,
      //   state: "READY",
      // });
      login(accessToken, refreshToken, expiresAt);
    } else if (
      refreshToken &&
      auth.state !== "READY" &&
      !hasAccessToken?.length
    ) {
      restoreAcessToken(refreshToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.state, restoreAcessToken]);

  const login = (accessToken, refreshToken, expires_at) => {
    setAuth({
      accessToken,
      refreshToken,
      isLoggedIn: !!accessToken?.length,
      state: "READY",
    });
    TokenService.saveTokens(accessToken, refreshToken, expires_at);
  };

  const logout = () => {
    TokenService.removeTokens();
    setAuth({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
      state: "READY",
    });
  };

  useEffect(() => {
    TokenService.setupInterceptors({ logout, restoreAcessToken });
  }, [restoreAcessToken]);

  const value = useMemo(
    () => ({
      auth,
      login,
      logout,
    }),
    [auth]
  );

  if (auth.state !== "READY") {
    return <div>restoring...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
