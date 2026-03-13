/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, type ReactNode } from "react";
import type { User } from "../../api/userTypes";
import { useMe, userKeys } from "../../api/userController";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextProps = {
  currentUser: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  handleLogout: () => void;
};

const initialValues: AuthContextProps = {
  currentUser: undefined,
  isAuthenticated: false,
  isLoading: true,
  handleLogout: () => null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<AuthContextProps>(initialValues);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading } = useMe();
  const hasToken = !!localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    queryClient.removeQueries({ queryKey: userKeys.me });
    window.location.href = "/login";
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading: hasToken && isLoading,
        handleLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const userAuthContext = () => {
  return useContext(UserContext);
};
