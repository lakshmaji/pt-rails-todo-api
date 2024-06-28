import React, { useState, useMemo, useCallback, useEffect } from "react";
import qs from "qs";
import {
  authConfig,
  fetchToken,
  generateCodeVerifierAndChallenge,
} from "./oauthConfig";
import { useHistory } from "react-router-dom";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const isAuthenticated = accessToken ? true : false;

    return {
      accessToken,
      refreshToken,
      isAuthenticated,
    };
  });

  const history = useHistory();

  const handleCallback = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const storedState = localStorage.getItem("oauthState");

    if (!code || state !== storedState) {
      console.error("State mismatch or missing code");
      return;
    }

    const codeVerifier = localStorage.getItem("code_verifier");
    const tokenResponse = await fetchToken(code, codeVerifier);

    setAuthState({
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      isAuthenticated: true,
    });

    localStorage.removeItem("oauthState");
    localStorage.removeItem("code_verifier");

    localStorage.setItem("access_token", tokenResponse.access_token);
    localStorage.setItem("refresh_token", tokenResponse.refresh_token);

    history.push("/");
  }, [history]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      setAuthState({
        accessToken,
        refreshToken: localStorage.getItem("refresh_token"),
        isAuthenticated: true,
      });
    }
  }, []);

  const login = useCallback(async () => {
    const { code_verifier, code_challenge } =
      await generateCodeVerifierAndChallenge();
    localStorage.setItem("code_verifier", code_verifier);

    const state = Math.random().toString(36).substring(7);
    localStorage.setItem("oauthState", state);

    const queryParams = {
      client_id: authConfig.clientId,
      response_type: authConfig.responseType,
      redirect_uri: authConfig.redirectUri,
      code_challenge,
      code_challenge_method: "S256",
      state,
      scope: authConfig.scope,
    };

    const queryString = qs.stringify(queryParams);
    const authorizationUrl = `${authConfig.authEndpoint}?${queryString}`;

    window.location.href = authorizationUrl;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAuthState({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
    // Redirect or navigate to login page
    history.push("/login");
  }, [history]);

  const value = useMemo(
    () => ({ authState, login, handleCallback, logout }),
    [authState, login, handleCallback, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
