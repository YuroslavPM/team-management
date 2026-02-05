import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import type { RegisterPayload } from "./authTypes";
import type { EditUser, User } from "./userTypes";
import { useMutation, useQuery } from "@tanstack/react-query";

export const userKeys = {
  allUsers: ["allUsers"],
  userDetails: (userId: number) => [userKeys.allUsers, `userDetails-${userId}`],
};

export const useGetAllUsers = () => {
  return useQuery<User[]>({
    queryKey: userKeys.allUsers,
    queryFn: async () => {
      const response = await axiosClient.get(`/users`);

      return response.data;
    },
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const fetchedUsers = queryClient.getQueryData<User[]>(userKeys.allUsers);

      const duplicatedEmail = fetchedUsers?.find((u) => u.email === data.email);

      if (duplicatedEmail) {
        throw new Error("Email already exists!");
      }

      const response = await axiosClient.post("/users", data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.allUsers });
    },
  });
};

export const useGetUserById = (id: number) => {
  return useQuery<User>({
    queryKey: userKeys.userDetails(id),
    queryFn: async () => {
      const response = await axiosClient.get(`/users/${id}`);
      return response.data;
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (data: EditUser) => {
      const response = await axiosClient.patch(`users/${data.id}`, data);

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.allUsers,
      });
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosClient.delete(`users/${userId}`);
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.userDetails(user.id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.allUsers,
      });
    },
  });
};
