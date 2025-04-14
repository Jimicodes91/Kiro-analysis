import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import CreateProjectTemplate from "@/pages/projects/templates/create-project-template";
import { RouteObject } from "react-router-dom";
import CompleteInvite from "../pages/Auth/CompleteInvite";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Login from "../pages/Auth/Login";
import ResetPassword from "../pages/Auth/ResetPassword";
import SignUp from "../pages/Auth/SignUp";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import Home from "../pages/Home";
import Admin from "../pages/Home/Admin";
import Client from "../pages/Home/Client";
import Event from "../pages/Home/Event";
import Finance from "../pages/Home/Finance";
import Message from "../pages/Home/Message";
import Project from "../pages/Home/Project";
import ProjectDetail from "../pages/Home/Project/ProjectDetail";
import NotFound from "../pages/Notfound";
import Onboarding from "../pages/Onboarding/index";

export const AuthRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      {
        path: "/",
        children: [
          { path: "register", element: <SignUp /> },
          { path: "complete-invite", element: <CompleteInvite /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "reset-password", element: <ResetPassword /> },
        ],
      },
    ],
  },
  { path: "verify-account", element: <VerifyEmail /> },
  {
    path: "onboarding",
    element: <Onboarding />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const HomeRoutes = {
  element: <DashboardLayout />,
  children: [
    {
      path: "home",
      element: <Home />,
    },
    {
      path: "admin",
      element: <Admin />,
    },
    {
      path: "client",
      element: <Client />,
    },
    {
      path: "event",
      element: <Event />,
    },
    {
      path: "finance",
      element: <Finance />,
    },
    {
      path: "message",
      element: <Message />,
    },
    {
      path: "projects",
      element: <Project />,
    },
    {
      path: "projects/create",
      element: <CreateProjectTemplate />,
    },
    {
      path: "projects/:id",
      element: <ProjectDetail />,
    },
  ],
};
