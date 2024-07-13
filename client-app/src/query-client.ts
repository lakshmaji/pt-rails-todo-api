import { MutationCache, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

type ApiError = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
};

function isApiErrorResponse(res: any): res is ApiError {
  return (
    res &&
    "type" in res &&
    "title" in res &&
    "status" in res &&
    "detail" in res &&
    "instance" in res
  );
}

export const handleErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return "Unknown error";
  }

  if (!error.response) {
    return error.message;
  }

  if (!isApiErrorResponse(error.response.data)) {
    if ("error" in error.response.data) {
      if (error.response.data.error === "invalid_grant") {
        if (JSON.parse(error.config?.data || "{}")?.email) {
          return "Invalid credentials";
        }
        return "Session expired";
      }
      return error.response.data.error[0];
    }
    return error.message;
  }

  return error.response.data.detail;
};

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.options.onError) return;

      const errorMessage = handleErrorMessage(error);
      toast.error(errorMessage, {
        toastId: errorMessage.toLowerCase().replace(" ", "-"),
      });
    },
  }),
});

export default queryClient;
