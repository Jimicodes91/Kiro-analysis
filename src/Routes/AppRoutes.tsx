// src/Routes.tsx
import { Navigate, RouteObject } from "react-router-dom";
import AuthLayout from "../Layouts/AuthLayout";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import Login from "../Pages/Auth/Login";
import SignUp from "../Pages/Auth/SignUp";
import NotFound from "../Pages/Notfound";
import OnboardingLayout from "../Layouts/OnboardingLayout.tsx";
import InviteTeamPage from "../Pages/Onboarding/Step2.tsx";
import CompanyDetailsPage from "../Pages/Onboarding/Step1.tsx";
import CompletionPage from "../Pages/Onboarding/Step3.tsx";

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
    element: <OnboardingLayout />,
    children: [
      { index: true, element: <Navigate to="company-details" replace /> }, 
        { path: "company-details", element: <CompanyDetailsPage /> },
        { path: "invite-team", element: <InviteTeamPage /> },
        { path: "completion", element: <CompletionPage /> },
      ]},
  {
    path: "*",
    element: <NotFound />,
  },
];