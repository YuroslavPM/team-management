import type { PriorityStatusTypes, TaskStatusTypes } from "./taskEnum";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  project?: number;
  assigned_user: number[];
  created_at?: string;
  updated_at?: string;
};

export type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  project?: number;
  assigned_user: number[];
};

export type ActionUserToTask = {
  id: number;
  assigned_user: number[];
};
