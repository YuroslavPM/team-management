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

export function getErrorDetailByKey(error: unknown, key: string) {
  if (isAxiosError<ApiErrorBody>(error)) {
    const detail = error.response?.data?.error?.details?.find(
      (e) => e.field === key,
    );

    return typeof detail?.message === "string" ? detail.message : undefined;
  }
}
