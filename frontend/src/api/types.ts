import type { ComboboxOption } from "../components/ui/Combobox";

/** Mirrors contracts/openapi.yaml. */
export type UserRole = "admin" | "member";
export type TeamRole = "lead" | "member";
export type ProjectRole = "admin" | "member";

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

export const projectStatusOptions: ComboboxOption<ProjectStatusType>[] =
  Object.entries(ProjectStatus).map(([value, label]) => ({
    value: value as ProjectStatusType,
    label,
  }));

export type ProjectMember = {
  userId: number;
  displayName: string;
  role: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatusType;
  teamIds: number[];
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
};
export type ProjectUpdate = {
  name?: string;
  description?: string;
  status?: ProjectStatusType;
  teamIds?: number[];
};

export const TaskStatus = {
  todo: "Todo",
  in_progress: "In progress",
  review: "Review",
  done: "Done",
} as const;

export type TaskStatusType = keyof typeof TaskStatus;

export const taskStatusOptions: ComboboxOption<TaskStatusType>[] =
  Object.entries(TaskStatus).map(([value, label]) => ({
    value: value as TaskStatusType,
    label,
  }));

export const TaskPriority = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
} as const;

export type TaskPriorityType = keyof typeof TaskPriority;

export const taskPriorityOptions: ComboboxOption<TaskPriorityType>[] =
  Object.entries(TaskPriority).map(([value, label]) => ({
    value: value as TaskPriorityType,
    label,
  }));

export type Task = {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
  assigneeId: number | null;
  dueDate: string;
  version: number;
  created_at: string;
  updated_at: string;
};

export type TaskBody = {
  title: string;
  description: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
  assigneeId?: number;
  dueDate: string;
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
