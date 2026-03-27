import type { AxiosError } from "axios";

export const getApiError = (error: unknown, fallback = "Something went wrong"): string => {
  const axiosError = error as AxiosError<Record<string, string | string[]>>;
  const data = axiosError?.response?.data;

  if (!data) return fallback;

  if (data.non_field_errors) {
    const msg = data.non_field_errors;
    return Array.isArray(msg) ? msg[0] : msg;
  }

  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const msg = data[firstKey];
    return Array.isArray(msg) ? msg[0] : msg;
  }

  return fallback;
};