import { RouteObject } from "react-router-dom";
import AuthLayout from "../Layouts/AuthLayout";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import Login from "../Pages/Auth/Login";
import SignUp from "../Pages/Auth/SignUp";
import NotFound from "../Pages/Notfound";
import Onboarding from "../Pages/Onboarding/index";
import SetUp from "../Pages/Auth/SetUp";
import DashboardLayout from "../Layouts/DashboardLayout";
import Home from "../Pages/Home";
import Client from "../Pages/Home/Client";
import Event from "../Pages/Home/Event";
import Message from "../Pages/Home/Message";
import Project from "../Pages/Home/Project";
import Finance from "../Pages/Home/Finance";
import Admin from "../Pages/Home/Admin";import ResetPassword from "../Pages/Auth/ResetPassword";
import VerifyEmail from "../Pages/Auth/VerifyEmail";
import ProjectDetail from "../Pages/Home/Project/ProjectDetail";


export const AuthRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      {
        path: "auth",
        children: [
          { path: "register", element: <SignUp /> },
          { path: "setup", element: <SetUp /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "reset-password", element: <ResetPassword /> },
        ],
      },
    ],
  },
  { path: "verify-account", 
    element: <VerifyEmail /> 
  },
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
      path: "project",
      element: <Project />,
    },
    {
      path: "projects/:id",
      element: <ProjectDetail />, 
    },
  ],
};
