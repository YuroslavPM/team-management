import type { PriorityStatusTypes, TaskStatusTypes } from "./taskEnum";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  projectId: number;
  assignedUserId: number[];
  created_at: Date;
  updated_at: Date;
};

export type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  projectId: number;
  assignedUserId: number[];
  created_at: Date;
  updated_at: Date;
};

export type ActionUserToTask = {
  id: number;
  assignedUserId: string[];
  updated_at: Date;
};