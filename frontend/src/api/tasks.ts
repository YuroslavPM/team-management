import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "../config/axios.config";
import type { Page, Project, Task, TaskBody } from "./types";

export const taskKeys = {
  all: ["tasks"] as const,
  list: () => [...taskKeys.all, "list"] as const,
  detail: (id: number) => [...taskKeys.all, "detail", id] as const,
};

export const useProjectTasks = (projectId: number) =>
  useQuery({
    queryKey: taskKeys.list(),
    queryFn: async () =>
      (
        await axiosClient.get<Page<Task>>(`/projects/${projectId}/tasks`, {
          params: { limit: 100 },
        })
      ).data,
  });

export const useMyTasks = () =>
  useQuery({
    queryKey: taskKeys.list(),
    queryFn: async () => (await axiosClient.get<Task>(`me/tasks`)).data,
  });

export const useTask = (taskId: number) =>
  useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: async () => (await axiosClient.get<Task>(`/tasks/${taskId}`)).data,
  });

export const useCreateTask = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: TaskBody) =>
      (await axiosClient.post<Task>(`/projects/${projectId}/tasks`, body)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
};

export const useEditTask = (taskId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: TaskBody) =>
      (await axiosClient.patch<TaskBody>(`/tasks/${taskId}`, body)).data,
    onSuccess: () => {
      if (taskId === undefined) {
        throw new Error("Task ID is required");
      }
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(taskId),
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });
    },
  });
};

export const useDeleteTask = (taskId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await axiosClient.delete<Project>(`/tasks/${taskId}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
};
