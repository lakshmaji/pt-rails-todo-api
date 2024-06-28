import React from "react";
import { useAuth } from "./AuthProvider";
import { Link } from "react-router-dom";

const Home = () => {
  const { authState } = useAuth();

  return (
    <div>
      <h2>Home</h2>
      {authState.isAuthenticated ? (
        <div>
          <Link to="/tasks">Tasks</Link>
          <p>Access Token: {authState.accessToken}</p>
          <p>Refresh Token: {authState.refreshToken}</p>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Home;
