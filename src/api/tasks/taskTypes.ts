import type { PriorityStatusTypes, TaskStatusTypes } from "./taskEnum";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  projectId: string;
  assignedUserId: string[];
  created_at: Date;
  updated_at: Date;
};

export type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  projectId: string;
  assignedUserId: string[];
  created_at: Date;
  updated_at: Date;
};

export type ActionUserToTask = {
  id: string;
  assignedUserId: string[];
  updated_at: Date;
};