import { Outlet, type RouteObject } from "react-router-dom";
import { LandingPage } from "./LandingPage";
import { Layout } from "../components/layout/Layout";
import ErrorPage from "./ErrorPage";
import { TeamsPage } from "./TeamsPage";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import { ProfilePage } from "./auth/ProfilePage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "/teams",
        element: <TeamsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        // path: "/login",
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/register",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        // path: "/login",
        index: true,
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/profile",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        // path: "/login",
        index: true,
        element: <ProfilePage />,
      },
    ],
  },
];
