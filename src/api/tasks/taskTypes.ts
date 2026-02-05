import type { PriorityStatusTypes, TaskStatusTypes } from "./taskEnum";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  projectId: string;
  assignedUserId: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  projectId: string;
  assignedUserId: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ActionUserToTask = {
  id: string;
  assignedUserId: string[];
  updatedAt: Date;
};