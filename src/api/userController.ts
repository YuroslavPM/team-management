import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import type { Login, RegisterPayload } from "./authTypes";
import type { EditUser, User } from "./userTypes";
import { useMutation, useQuery } from "@tanstack/react-query";

export const userKeys = {
  allUsers: ["allUsers"],
  me: ["me"],
  userDetails: (userId: number) => [userKeys.allUsers, `userDetails-${userId}`],
};
export const useMe = () => {
  const hasToken = !!localStorage.getItem("authToken");

  return useQuery<User>({
    queryKey: userKeys.me,
    queryFn: async () => {
      const response = await axiosClient.get("/users/me/");
      return response.data;
    },
    enabled: hasToken,
    retry: false,
    staleTime: Infinity,
  });
};
export const useGetAllUsers = () => {
  return useQuery<User[]>({
    queryKey: userKeys.allUsers,
    queryFn: async () => {
      const response = await axiosClient.get(`/users/`);

      return response.data;
    },
  });
};

export const useCreateUser = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {

      const response = await axiosClient.post("/users/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.allUsers });
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

export const useLogin = (onSuccessCallback?: (data: Login) => void) => {
  return useMutation({
    mutationFn: async (data: { email: string; secret: string }) => {
      const response = await axiosClient.post("/login/", {
        username: data.email,
        password: data.secret,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      localStorage.setItem("authToken", data.token);
      axiosClient.defaults.headers.common["Authorization"] =
        `Token ${data.token}`;

      await queryClient.fetchQuery({
        queryKey: userKeys.me,
        queryFn: async () => {
          const response = await axiosClient.get("/users/me/");
          return response.data;
        },
      });
      if (onSuccessCallback) onSuccessCallback(data);
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
      const response = await axiosClient.patch(`/users/${data.id}/`, data);

      return response.data;
    },

    onSuccess: (updatedUser: User) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.allUsers,
      });
      const me = queryClient.getQueryData<User>(userKeys.me);
      if(me?.id === updatedUser.id) {
        queryClient.invalidateQueries({
          queryKey: userKeys.me,
        });
      }
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      await axiosClient.delete(`/users/${userId}/`);
      return userId;
    },
    onSuccess: (deletedId: string) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.userDetails(Number(deletedId)),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.allUsers,
      });
    },
  });
};
