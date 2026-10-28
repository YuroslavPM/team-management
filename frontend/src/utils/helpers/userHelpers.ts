import type { User } from "../../api/types";

export const isAdmin = (user: User) => {
  if (user.role === "admin") {
    return true;
  }
  return false;
};
