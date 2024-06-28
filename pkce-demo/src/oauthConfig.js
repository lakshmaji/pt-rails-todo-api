// src/oauthConfig.js

import axios from "axios";
import pkceChallenge from "pkce-challenge";
import qs from "qs";

const authEndpoint = "http://localhost:3001/oauth/authorize";
const tokenEndpoint = "http://localhost:3001/oauth/token";
const clientId = "mapp_id"; // Replace with your Doorkeeper client ID
const redirectUri = "http://localhost:3000/callback";
const responseType = "code";
const scope = "read write";

export const authConfig = {
  authEndpoint,
  tokenEndpoint,
  clientId,
  redirectUri,
  responseType,
  scope,
};

export const fetchToken = async (code, codeVerifier) => {
  const requestData = {
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  };

  const response = await axios.post(tokenEndpoint, qs.stringify(requestData), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

export const generateCodeVerifierAndChallenge = async () => {
  return await pkceChallenge();
};
