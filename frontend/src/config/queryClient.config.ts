import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 5,
      staleTime: 1000 * 60 * 3,
      retry: (failureCount, error) => {
        return (
          axios.isAxiosError(error) &&
          error.response?.status !== undefined &&
          error.response.status >= 500 &&
          error.response.status < 600 &&
          failureCount < 5
        );
      },
      retryDelay: 1000 * 2,
    },
  },
});
