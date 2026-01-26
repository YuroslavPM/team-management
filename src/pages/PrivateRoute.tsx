/* eslint-disable react-refresh/only-export-components */
import { Navigate } from "react-router-dom";
import { userAuthContext } from "../utils/context/UserContext";
import type { ReactNode } from "react";

export function authRoutes(Component: React.ComponentType) {
  return () => {
    const { currentUser } = userAuthContext();

    if (!currentUser) {
      return <Navigate to={"/login"} />;
    }

    return <Component />;
  };
}

export function loggedRoutes(Component: React.ComponentType) {
  return () => {
    const { currentUser } = userAuthContext();

    if (!currentUser) {
      return <Component/>;
    }
    return <Navigate to={"/"}/>

  };
}

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser } = userAuthContext();

  if (!currentUser) {
    return <Navigate to={"/login"} />;
  }

  return children;
};
