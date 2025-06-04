import AuthLayout from "@/layouts/auth-layout";
import AccountLayout from "@/layouts/dashboard-layout/lol";
import ProjectDetailsPageWrapper from "@/pages/Home/project-details";
import OnboardingContextProvider from "@/pages/Onboarding/onboarding-context";
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
// import Client from "../pages/Home/Client";
// import Event from "../pages/Home/Event";

import ProtectedRoute from "@/components/ui/protected-route";
import Contact from "@/pages/Home/Contact";
import Task from "@/pages/Home/Task";
import NotFound from "@/pages/Notfound";
import ProfilePage from "@/pages/profile";
import NotificationSection from "@/pages/profile/templates/notification";
import EditProfileDetails from "@/pages/profile/templates/profile-details";
import ProfileSecurityTemplate from "@/pages/profile/templates/security";
import SysAdminCompanyPage from "@/pages/sysadmin/company";
import SysAdminCompanySubscriptionPage from "@/pages/sysadmin/company/sections/subscritptions-section";
import SysAdminHomePage from "@/pages/sysadmin/home";
import SysAdminSubscriptionPage from "@/pages/sysadmin/subscriptions";
import SysAdminUsersPage from "@/pages/sysadmin/users";
import Finance from "../pages/Home/Finance";
import Project from "../pages/Home/Project";
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

    element: (
      <OnboardingContextProvider>
        <Onboarding />
      </OnboardingContextProvider>
    ),
  },
  {
    path: "*",
    element: <AccountLayout />,
    children: [
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export const HomeRoutes = {
  element: <AccountLayout />,
  children: [
    // Free role route accessible by all except SYSADMIN
    {
      path: "profile-setting",
      element: <ProfilePage />,
    },
    // Accessible by only ADMIN and CONSULTANT
    {
      element: <ProfilePage />,
      path: "profile-setting",
      children: [
        {
          path: "",
          element: <EditProfileDetails />,
        },
        {
          path: "notification",
          element: <NotificationSection />,
        },
        {
          path: "security",
          element: <ProfileSecurityTemplate />,
        },
      ],
    },

    // Accessible by only ADMIN and CONSULTANT
    {
      element: <ProtectedRoute allowedRoles={["ADMIN", "CONSULTANT"]} />,
      path: "",
      children: [
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "task",
          element: <Task />,
        },
      ],
    },

    // Accessible by only SYSADMIN
    {
      element: <ProtectedRoute allowedRoles={["SYSADMIN"]} />,
      path: "sysadmin",
      children: [
        {
          path: "users",
          element: <SysAdminUsersPage />,
        },
        {
          path: "",
          element: <SysAdminHomePage />,
        },
        {
          path: "subscription",
          element: <SysAdminSubscriptionPage />,
        },
        {
          path: ":companyId/companies",
          element: <SysAdminCompanyPage />,
        },
        {
          path: ":companyId/companies/subscription",
          element: <SysAdminCompanySubscriptionPage />,
        },
      ],
    },
    {
      path: "finance",
      element: <Finance />,
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
      element: <ProjectDetailsPageWrapper />,
    },

    {
      element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
      children: [
        {
          path: "admin",
          element: <Admin />,
        },
      ],
    },
  ],
};
