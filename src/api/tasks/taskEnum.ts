export const TaskStatus = {
  Todo: "todo",
  InProgress: "in-progress",
} as const;

export const PriorityStatus = {
  Low: "low",
  Medium: "medium",
  High: "high",
} as const;

export type TaskStatusTypes = (typeof TaskStatus)[keyof typeof TaskStatus];
export type PriorityStatusTypes =
  (typeof PriorityStatus)[keyof typeof PriorityStatus];
