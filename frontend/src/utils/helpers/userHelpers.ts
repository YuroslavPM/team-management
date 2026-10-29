import type { Project, User } from "../../api/types";

export const isAdmin = (user: User) => {
  if (user.role === "admin") {
    return true;
  }
  return false;
};

export const canProjectManage = (user: User, project: Project) => {
  return (
    user?.role === "admin" ||
    project.members.some((m) => m.userId === user?.id && m.role === "lead")
  );
};
