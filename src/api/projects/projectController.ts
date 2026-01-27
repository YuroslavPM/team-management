import { useMutation, useQuery } from "@tanstack/react-query";
import type { Project } from "./projectTypes";
import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";
import { teamKeys } from "../teams/teamController";

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

export const useCreateProjects = () => {
  return useMutation({
    mutationFn: async (data: Project) => {
      const response = await axiosClient.post("projects", {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
  });
};

export const useUpdateProjects = () => {
  return useMutation({
    mutationFn: async (data: Project) => {
      const response = await axiosClient.patch(`projects/${data.id}`, {
        ...data,
        updatedAt: new Date(),
      });
      return response.data;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: teamKeys.teamDetails(project.data),
      });
    },
  });
};

export const useDeleteProjects = () => {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await axiosClient.delete(`projects/${projectId}`);
      return response;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectDetails(project.data),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.allProjects,
      });
    },
  });
};
