import type { PriorityStatusTypes, TaskStatusTypes } from "./taskEnum";

export type Task = {
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  projectId: number;
  assignedUserId: number;
};
