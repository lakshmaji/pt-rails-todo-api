import React, { useEffect } from "react";
import { useAuth } from "./AuthProvider";

const Callback = () => {
  const { handleCallback } = useAuth();

  useEffect(() => {
    handleCallback().catch((error) =>
      console.error("Failed to handle callback", error)
    );
  }, [handleCallback]);

  return (
    <div>
      <h2>Loading...</h2>
    </div>
  );
};

export default Callback;
