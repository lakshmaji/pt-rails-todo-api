import React from "react";
import { useAuth } from "./AuthProvider";

const Login = () => {
  const { login } = useAuth();

  return (
    <div>
      <h2>Login</h2>
      <button onClick={login}>Login with OAuth2</button>
    </div>
  );
};

export default Login;
