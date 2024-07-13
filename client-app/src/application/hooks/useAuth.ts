import React from "react";
import { AuthContext } from "../providers/AuthProvider";

export function useAuth() {
  return React.useContext(AuthContext);
}
