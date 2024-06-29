import React, { FC } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./application/hooks/useAuth";

interface Props {
  children: JSX.Element;
}
const ProtectedRoute: FC<Props> = ({ children }) => {
  let { auth } = useAuth();
  let location = useLocation();

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
