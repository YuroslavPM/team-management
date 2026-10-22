import type { ComboboxOption } from "../components/ui/Combobox";

/** Mirrors contracts/openapi.yaml. */
export type UserRole = "admin" | "member";
export type TeamRole = "lead" | "member";

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type TeamMember = {
  userId: number;
  displayName: string;
  role: TeamRole;
};

export type Team = {
  id: number;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
};

export type StatusFilter = ProjectStatusType | "all";


export const ProjectStatus = {
  planned: "Planned",
  active: "Active",
  on_hold: "On hold",
  done: "Done",
} as const;

export type ProjectStatusType = keyof typeof ProjectStatus;

export const statusOptions: ComboboxOption<ProjectStatusType>[] =
  Object.entries(ProjectStatus).map(([value, label]) => ({
    value: value as ProjectStatusType,
    label,
  }));

export type ProjectMember = {
  userId: number;
  role: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatusType;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
};

export type Page<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
};
