export const ProjectStatus = {
  Completed: "completed",
  Active: "active",
  Paused: "paused",
  Cancel: "cancel",
} as const;

export type ProjectStatusTypes =
  (typeof ProjectStatus)[keyof typeof ProjectStatus];