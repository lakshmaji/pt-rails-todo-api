import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  FC,
  ReactNode,
} from "react";
import TokenService from "../../tokenService";
import { useRefreshToken } from "../use-cases/auth/useRefreshToken";

interface AuthContextState {
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
  state: "PENDING" | "READY";
}

type AuthContextType = {
  auth: AuthContextState;
  login: (
    accessToken: string,
    refreshToken: string,
    expires_at: number
  ) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface Props {
  children?: ReactNode | undefined;
}
const AuthProvider: FC<Props> = ({ children }) => {
  const [auth, setAuth] = useState<AuthContextState>({
    accessToken: "",
    refreshToken: "",
    isLoggedIn: false,
    state: "PENDING",
  });

  const {
    mutateAsync: callRefreshTokenAPI,
    status: loadingRefreshToken,
    ...rest
  } = useRefreshToken();

  const restoreAcessToken = useCallback(
    async (oldRefreshToken: string) => {
      try {
        const res = await callRefreshTokenAPI(oldRefreshToken);
        if (res?.access_token) {
          // assume success
          const created_at = new Date(res.created_at);
          created_at.setSeconds(res.expires_in);
          login(res.access_token, res.refresh_token, created_at.valueOf());
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
    if (
      isNotEmpty(accessToken) &&
      isNotEmpty(refreshToken) &&
      auth.state !== "READY"
    ) {
      // setAuth({
      //   accessToken,
      //   refreshToken,
      //   // assuming already logged in due to presense of access token
      //   isLoggedIn: true,
      //   state: "READY",
      // });
      login(accessToken, refreshToken, parseInt(expiresAt || "0"));
    } else if (isEmpty(refreshToken) && auth.state !== "READY") {
      // setAuth({
      //   accessToken,
      //   refreshToken,
      //   isLoggedIn: false,
      //   state: "READY",
      // });
      login(accessToken ?? "", refreshToken ?? "", parseInt(expiresAt || "0"));
    } else if (
      isNotEmpty(refreshToken) &&
      auth.state !== "READY" &&
      !hasAccessToken?.length
    ) {
      restoreAcessToken(refreshToken ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.state, restoreAcessToken]);

  const login = (
    accessToken: string | null,
    refreshToken: string | null,
    expires_at: number
  ) => {
    setAuth({
      accessToken: accessToken ?? "",
      refreshToken: refreshToken ?? "",
      isLoggedIn: !!accessToken?.length,
      state: "READY",
    });
    TokenService.saveTokens(
      accessToken ?? "",
      refreshToken ?? "",
      expires_at.toString()
    );
  };

  const logout = () => {
    TokenService.removeTokens();
    setAuth({
      accessToken: "",
      refreshToken: "",
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

const isEmpty = (value: string | null): boolean => {
  if (value === null) {
    return true;
  }
  return (value || "").trim().length === 0;
};

const isNotEmpty = (value: string | null): boolean =>
  !!value && !isEmpty(value);

export { AuthContext, AuthProvider };
