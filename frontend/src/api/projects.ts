import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "../config/axios.config";
import type { Page, Project, TeamRole } from "./types";

export const projectKeys = {
  all: ["projects"] as const,
  list: () => [...projectKeys.all, "list"] as const,
  detail: (id: number) => [...projectKeys.all, "detail", id] as const,
};

export const useProjects = () =>
  useQuery({
    queryKey: projectKeys.list(),
    queryFn: async () =>
      (
        await axiosClient.get<Page<Project>>("/projects", {
          params: { limit: 100 },
        })
      ).data,
  });

export const useProject = (projectId: number) =>
  useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: async () =>
      (await axiosClient.get<Project>(`/projects/${projectId}`)).data,
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; description?: string }) =>
      (await axiosClient.post<Project>("/projects", body)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
};

export const useAddProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { userId: number; role: TeamRole }) =>
      (await axiosClient.post<Project>(`/projects/${projectId}/members`, body))
        .data,
    onSuccess: (team) => {
      queryClient.setQueryData(projectKeys.detail(projectId), team);
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
};

export const useRemoveProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      await axiosClient.delete(`/projects/${projectId}/members/${userId}`);
    },
    // Optimistic: drop the member from the cached project right away.
    onMutate: (userId) => {
      queryClient.setQueryData<Project>(projectKeys.detail(projectId), (project) =>
        project ? { ...project, members: project.members.filter((m) => m.userId !== userId) } : project,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.list() }),
  });
};

