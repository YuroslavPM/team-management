import { isAxiosError } from "axios";

import type { ApiErrorBody } from "./types";

/** A human-readable message for any error thrown by an API call. */
export function errorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function getErrorDetail(error: unknown) {
  if (isAxiosError<ApiErrorBody>(error)) {
    return String(error.response?.data?.error?.details?.[0]?.message);
  }
}
