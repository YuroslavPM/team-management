import { Outlet, type RouteObject } from "react-router-dom";
import { LandingPage } from "./LandingPage";
import { Layout } from "../components/layout/Layout";
import ErrorPage from "./ErrorPage";
import { TeamsPage } from "./TeamsPage";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import { ProfilePage } from "./auth/ProfilePage";
import { authRoutes, loggedRoutes, ProtectedRoute } from "./PrivateRoute";
import { ProjectPage } from "./ProjectPage";
import { ProjectDetailPage } from "./ProjectDetailPage";
import { TaskPage } from "./TaskPage";

const TeamsProtectedPage = authRoutes(TeamsPage);
const ProjectProtectedPage = authRoutes(ProjectPage);
const ProjectProtectedDetailPage = authRoutes(ProjectDetailPage);
const TasksProtectedPage = authRoutes(TaskPage);
const ProfileProtectedPage = authRoutes(ProfilePage);
const LoginProtectedPage = loggedRoutes(LoginPage);
const RegisterProtectedPage = loggedRoutes(RegisterPage);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/teams",
        element: <TeamsProtectedPage />,
      },
      {
        path: "/projects",
        element: <ProjectProtectedPage />,
      },
      {
        path: "/projects/:id",
        element: <ProjectProtectedDetailPage />,
      },
      {
        path: "/tasks",
        element: <TasksProtectedPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LoginProtectedPage />,
      },
    ],
  },
  {
    path: "/register",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <RegisterProtectedPage />,
      },
    ],
  },
  {
    path: "/profile",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ProfileProtectedPage />,
      },
    ],
  },
];
