import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import type { Login, RegisterPayload } from "./authTypes";
import type { EditUser, User } from "./userTypes";
import { useMutation, useQuery } from "@tanstack/react-query";

export const userKeys = {
  allUsers: ["allUsers"],
  userDetails: (userId: number) => [userKeys.allUsers, `userDetails-${userId}`],
};

export const useGetAllUsers = () => {
  return useQuery<User[]>({
    queryKey: [userKeys.allUsers],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/users`);

      return data;
    },
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: RegisterPayload) =>{
      
      const fetchedUsers = queryClient.getQueryData<User[]>(userKeys.allUsers);

      const dublicatedEmail = fetchedUsers?.find((u)=> u.email === data.email);

      if(dublicatedEmail){
        throw new Error("Email already exists!");
      }
      
      return await axiosClient.post("/users", {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.allUsers });
    },
  });
};

export const useGetUser = () => {
  return useMutation({
    mutationFn: async (data: Login) => {
      const response = axiosClient.post("/users", data);
      return (await response).data;
    },
    onSuccess: (user) => {
      //how to have the id based on the email and secret
      queryClient.invalidateQueries({
        queryKey: userKeys.userDetails(user.id),
      });
    },
  });
};

export const useGetUserById = (id:number|undefined) => {
  return useQuery<User>({
    queryKey: [userKeys.userDetails, id],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/users/${id}`, );
      return data;
    },
  });
};

export const useUpdateUser = () =>{
    return useMutation({
      mutationFn: async (data: EditUser) =>
        await axiosClient.patch(`users/${data.id}`,{
          ...data,
          updatedAt: new Date()
        }),
      onSuccess: (user) => {
        queryClient.invalidateQueries({
          queryKey: userKeys.userDetails(user.data.id)
        });
      },
    });
};

export const useDeleteUser = () => {
    return useMutation({
      mutationFn: async (userId: number|undefined) =>{
        const response = axiosClient.delete(`users/${userId}`);
        return (await response).data
      },
      onSuccess: (user) =>{
        queryClient.invalidateQueries({
          queryKey: userKeys.userDetails(user.userId)
        })
      }
    })
}
