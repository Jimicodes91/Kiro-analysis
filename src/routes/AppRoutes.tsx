import AuthLayout from "@/layouts/auth-layout";
import OnboardingContextProvider from "@/pages/Onboarding/onboarding-context";
import { RouteObject } from "react-router-dom";
import CompleteInvite from "../pages/Auth/CompleteInvite";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Login from "../pages/Auth/Login";
import ResetPassword from "../pages/Auth/ResetPassword";
import SignUp from "../pages/Auth/SignUp";
import VerifyEmail from "../pages/Auth/VerifyEmail";

import VerifyAccountEmail from "@/pages/Auth/VerifyAccountEmail";
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
          { path: "verify-email", element: <VerifyAccountEmail /> },
        ],
      },
    ],
  },
  { path: "verify-account", element: <VerifyEmail /> },
  {
    path: "onboarding",

    element: (
      <OnboardingContextProvider>
        <Onboarding />
      </OnboardingContextProvider>
    ),
  },
  // {
  //   path: "*",
  //   element: <NotFound fullScreen />,
  // },
];
