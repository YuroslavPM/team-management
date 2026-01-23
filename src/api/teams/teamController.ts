import { useMutation, useQuery } from "@tanstack/react-query";
import type { Team } from "./teamTypes";
import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";

export const teamKeys = {
  allTeams: ["allTeams"],
  teamDetails: (teamId: number) => [teamKeys.allTeams, `teamDetails-${teamId}`],
};

export const useGetAllTeams = () => {
  return useQuery<Team[]>({
    queryKey: [teamKeys.allTeams],
    queryFn: async () => {
      const { data } = await axiosClient.get("/teams");
      return data;
    },
  });
};

export const useCreateTeam = () => {
  return useMutation({
    mutationFn: async (data: Team) =>
      await axiosClient.post("/teams", {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
  });
};

export const useGetTeam = (teamId: number) => {
  return useQuery<Team>({
    queryKey:[teamKeys.teamDetails(teamId)],
    queryFn: async () => {
        const { data } = await axiosClient.get(`teams/${teamId}`);
        return data;
    }
  })
};

export const useUpdateTeam = () => {
  return useMutation({
    mutationFn: async (data: Team) =>
      await axiosClient.put(`teams/${data.id}`, {
        ...data,
        updatedAt: new Date().getTime(),
      }),
    onSuccess: (team) => {
      queryClient.invalidateQueries({ 
        queryKey: teamKeys.teamDetails(team.data.id) 
    });
    },
  });
};

export const useDeleteTeam = () => {
  return useMutation({
        mutationFn: async (data: Team) =>{
          const response = axiosClient.delete(`teams/${data.id}`);
          return (await response).data
        },
        onSuccess: (team) =>{
          queryClient.invalidateQueries({
            queryKey: teamKeys.teamDetails(team.teamId)
          })
        }
      })
};


// export const addUserToTeam = () => {
//   return useMutation({
//     mutationFn: async (data: Team, userIds: number[]) =>
//       await axiosClient.put(`teams/:${data.id}`, {
//         ...data,
//         updatedAt: new Date().getTime(),
//         },
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
//     },
//   });
// };


