import { useMutation, useQuery } from "@tanstack/react-query";
import type { ActionUserToTask, Task, TaskPayload } from "./taskTypes";
import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";

export const taskKeys = {
  allTasks: ["allTasks"],
  taskDetails: (taskId: number) => [taskKeys.allTasks, `taskDetails-${taskId}`],
};

export const useGetAllTasks = () => {
  return useQuery<Task[]>({
    queryKey: taskKeys.allTasks,
    queryFn: async () => {
      const response = await axiosClient.get("/tasks");
      return response.data;
    },
  });
};

export const useCreateTask = () => {
  return useMutation({
    mutationFn: async (data: TaskPayload) => {
      const response = await axiosClient.post("tasks", {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.allTasks });
    },
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: async (data: TaskPayload & { id: string }) => {
      const response = await axiosClient.patch(`tasks/${data.id}`, {
        ...data,
        updatedAt: new Date(),
      });
      return response.data;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.taskDetails(task.id),
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.allTasks,
      });
    },
  });
};

export const useAddUserToTask = () => {
  return useMutation({
    mutationFn: async (data: ActionUserToTask) => {
      const response = await axiosClient.patch(`tasks/${data.id}`, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.allTasks,
      });
    },
  });
};

export const useRemoveUserToTask = () => {
  return useMutation({
    mutationFn: async (data: ActionUserToTask) => {
      const response = await axiosClient.patch(`tasks/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.allTasks,
      });
    },
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await axiosClient.delete(`tasks/${taskId}`);
      return response.data;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.taskDetails(task.id),
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.allTasks,
      });
    },
  });
};
