import type { PriorityStatusTypes, TaskStatusTypes } from "./taskEnum";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  project: number;
  assigned_user: number[];
  created_at: Date;
  updated_at: Date;
};

export type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  project: number;
  assigned_user: number[];
  created_at: Date;
  updated_at: Date;
};

export type ActionUserToTask = {
  id: number;
  assignedUserId: string[];
  updated_at: Date;
};
