// src/Routes.tsx
import { RouteObject } from "react-router-dom";
import AuthLayout from "../Layouts/AuthLayout";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import Login from "../Pages/Auth/Login";
import SignUp from "../Pages/Auth/SignUp";
import NotFound from "../Pages/Notfound";
import Onboarding from "../Pages/Onboarding/index";

export const AuthRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> }, 
      { path: "auth", children: [
        { path: "register", element: <SignUp /> },
        { path: "forgot-password", element: <ForgotPassword /> },
      ]},
    ],
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