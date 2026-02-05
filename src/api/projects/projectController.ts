import { useMutation, useQuery } from "@tanstack/react-query";
import type { ActionUserToProject, Project, ProjectPayload } from "./projectTypes";
import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";

export const projectKeys = {
  allProjects: ["allProjects"],
  projectDetails: (projectId: number) => [
    projectKeys.allProjects,
    `projectDetails-${projectId}`,
  ],
};

export const useGetAllProjects = () => {
  return useQuery<Project[]>({
    queryKey: projectKeys.allProjects,
    queryFn: async () => {
      const response = await axiosClient.get("projects");
      return response.data;
    },
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: async (data: ProjectPayload) => {
      const response = await axiosClient.post("projects", {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.allProjects });
    },
  });
};

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: async (data: ProjectPayload & { id: string }) => {
      const response = await axiosClient.patch(`projects/${data.id}`, {
        ...data,
        updatedAt: new Date(),
      });
      return response.data;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectDetails(project.id),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.allProjects,
      });
    },
  });
};

export const useAddUserToProject = () => {
  return useMutation({
    mutationFn: async (data: ActionUserToProject) => {
      const response = await axiosClient.patch(`projects/${data.id}`, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.allProjects,
      });
    },
  });
};

export const useRemoveUserToProject = () => {
  return useMutation({
    mutationFn: async (data: ActionUserToProject) => {
      const response = await axiosClient.patch(`projects/${data.id}`, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.allProjects,
      });
    },
  });
};

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await axiosClient.delete(`projects/${projectId}`);
      return response.data;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectDetails(project.id),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.allProjects,
      });
    },
  });
};
