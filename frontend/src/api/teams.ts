import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "../config/axios.config";
import type { Page, Team, TeamRole } from "./types";

export const teamKeys = {
  all: ["teams"] as const,
  list: () => [...teamKeys.all, "list"] as const,
  detail: (id: number) => [...teamKeys.all, "detail", id] as const,
};

export const useTeams = () =>
  useQuery({
    queryKey: teamKeys.list(),
    queryFn: async () =>
      (await axiosClient.get<Page<Team>>("/teams", { params: { limit: 100 } }))
        .data,
  });

export const useTeam = (teamId: number) =>
  useQuery({
    queryKey: teamKeys.detail(teamId),
    queryFn: async () => (await axiosClient.get<Team>(`/teams/${teamId}`)).data,
  });

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; description?: string }) =>
      (await axiosClient.post<Team>("/teams", body)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teamKeys.all }),
  });
};

export const useAddTeamMember = (teamId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { userId: number; role: TeamRole }) =>
      (await axiosClient.post<Team>(`/teams/${teamId}/members`, body)).data,
    onSuccess: (team) => {
      queryClient.setQueryData(teamKeys.detail(teamId), team);
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
};

export const useRemoveTeamMember = (teamId: number) => {
  const queryClient = useQueryClient();
  const queryKey = teamKeys.detail(teamId);
  return useMutation({
    mutationFn: async (userId: number) => {
      await axiosClient.delete(`/teams/${teamId}/members/${userId}`);
    },

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey });
      const perviousTeam = queryClient.getQueryData<Team>(queryKey);
      if (perviousTeam) {
        queryClient.setQueryData<Team>(queryKey, {
          ...perviousTeam,
          members: perviousTeam.members.filter((m) => m.userId !== userId),
        });
      }
      return { perviousTeam };
    },
    onError: (_error, _userId, context) => {
      if (context?.perviousTeam) {
        queryClient.setQueryData(queryKey, context.perviousTeam);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: teamKeys.list() }),
  });
};
