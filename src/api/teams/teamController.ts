import { useMutation, useQuery } from "@tanstack/react-query";
import type { Team, TeamPayload } from "./teamTypes";
import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";

export const teamKeys = {
  allTeams: ["allTeams"],
  teamDetails: (teamId: number) => [teamKeys.allTeams, `teamDetails-${teamId}`],
};

export const useGetAllTeams = () => {
  return useQuery<Team[]>({
    queryKey: teamKeys.allTeams,
    queryFn: async () => {
      const response = await axiosClient.get("/teams");
      return response.data;
    },
  });
};

export const useCreateTeam = () => {
  return useMutation({
    mutationFn: async (data: TeamPayload) => {
      const response = await axiosClient.post("/teams", {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    }
});
};

export const useUpdateTeam = () => {
  return useMutation({
    mutationFn: async (data: TeamPayload & { id: string }) => {
      const response = await axiosClient.patch(`teams/${data.id}`, {
        ...data,
        updatedAt: new Date().getTime(),
      });
      return response.data;
    },
    onSuccess: () => {
       queryClient.invalidateQueries({
         queryKey: teamKeys.allTeams,
       });
    },
  });
};

export const useDeleteTeam = () => {
  return useMutation({
    mutationFn: async (teamId: string) => {
      const response = await axiosClient.delete(`teams/${teamId}`);
      return response.data;
    },
    onSuccess: (team) => {
      queryClient.invalidateQueries({
        queryKey: teamKeys.teamDetails(team.teamId),
      });
      queryClient.invalidateQueries({
        queryKey: teamKeys.allTeams,
      });
    },
  });
};
