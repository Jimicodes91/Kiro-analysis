export type UserRole = "CLIENT" | "ADMIN" | "CONSULTANT" | "SUPER_ADMIN";

interface AppRoute {
  path: string;
  element: React.ReactNode;
  roles: UserRole[]; // who can access
  layout?:
    | React.ComponentType<{ children?: React.ReactNode }>
    | React.ComponentType<{ children?: React.ReactNode }>[]; // optional layout override
}

import AccountLayout from "@/layouts/dashboard-layout/lol";
import Home from "../pages/Home";

import ClientAccountLayout from "@/layouts/dashboard-layout/client-layout";
import ClientDocumentManagement from "@/pages/client/documents";
import ClientHomePage from "@/pages/client/home";
import ClientProjectJourney from "@/pages/client/journey";
import ClientTaskManagement from "@/pages/client/tasks";
import ClientTaskDetailPage from "@/pages/client/tasks/client-task-detail-page";
import PendingInvites from "@/pages/Home/Admin/pending-invites";
import Contact from "@/pages/Home/Contact";
import NotificationsPage from "@/pages/Home/Notifications";
import ProjectDetailsPageWrapper from "@/pages/Home/project-details";
import Task from "@/pages/Home/Task";
import ExternalTaskForm from "@/pages/Home/Task/external-task-form";
import InternalTaskForm from "@/pages/Home/Task/internal-task-form";
import TaskTypeSelectorPage from "@/pages/Home/Task/task-type-selector";
import NotFound from "@/pages/Notfound";
import ProfilePageLayout from "@/pages/profile";
import EditOrganizationDetails from "@/pages/profile/templates/org-details";
import EditProfileDetails from "@/pages/profile/templates/profile-details";
import ProfileSecurityTemplate from "@/pages/profile/templates/security";
import CreateProjectTemplate from "@/pages/projects/templates/create-project-template";
import SysAdminCompanyPage from "@/pages/sysadmin/company";
import SysAdminCompanySubscriptionPage from "@/pages/sysadmin/company/sections/subscritptions-section";
import SysAdminHomePage from "@/pages/sysadmin/home";
import SysAdminSubscriptionPage from "@/pages/sysadmin/subscriptions";
import SysAdminUsersPage from "@/pages/sysadmin/users";
import Admin from "../pages/Home/Admin";
import Finance from "../pages/Home/Finance";
import Project from "../pages/Home/Project";

export const appRoutes: AppRoute[] = [
  {
    path: "/home",
    element: <ClientHomePage />,
    roles: ["CLIENT"],
    layout: ClientAccountLayout,
  },
  {
    path: "/journey",
    element: <ClientProjectJourney />,
    roles: ["CLIENT"],
    layout: ClientAccountLayout,
  },
  {
    path: "/tasks",
    element: <ClientTaskManagement />,
    roles: ["CLIENT"],
    layout: ClientAccountLayout,
  },
  {
    path: "/tasks/:projectId/:taskId",
    element: <ClientTaskDetailPage />,
    roles: ["CLIENT"],
    layout: ClientAccountLayout,
  },
  {
    path: "/documents",
    element: <ClientDocumentManagement />,
    roles: ["CLIENT"],
    layout: ClientAccountLayout,
  },
  //   Profile routes
  {
    path: "/profile-settings",
    element: <EditProfileDetails />,
    roles: ["CLIENT"],
    layout: [ProfilePageLayout, ClientAccountLayout],
  },
  {
    path: "/profile-settings/security",
    element: <ProfileSecurityTemplate />,
    roles: ["CLIENT"],
    layout: [ProfilePageLayout, ClientAccountLayout],
  },

  {
    path: "/home",
    element: <Home />,
    roles: ["ADMIN", "CONSULTANT"],
    layout: AccountLayout,
  },
  {
    path: "/contact",
    element: <Contact />,
    roles: ["ADMIN", "CONSULTANT"],
    layout: AccountLayout,
  },
  {
    path: "/task",
    element: <Task />,
    roles: ["ADMIN", "CONSULTANT"],
    layout: AccountLayout,
  },
  {
    path: "/task/new",
    element: <TaskTypeSelectorPage />,
    roles: ["ADMIN", "CONSULTANT"],
    layout: AccountLayout,
  },
  {
    path: "/task/new/internal",
    element: <InternalTaskForm />,
    roles: ["ADMIN", "CONSULTANT"],
    layout: AccountLayout,
  },
  {
    path: "/task/new/external",
    element: <ExternalTaskForm />,
    roles: ["ADMIN", "CONSULTANT"],
    layout: AccountLayout,
  },

  {
    path: "/users",
    element: <SysAdminUsersPage />,
    roles: ["SUPER_ADMIN"],
    layout: AccountLayout,
  },
  {
    path: "/home",
    element: <SysAdminHomePage />,
    layout: AccountLayout,
    roles: ["SUPER_ADMIN"],
  },
  {
    path: "/subscription",
    element: <SysAdminSubscriptionPage />,
    layout: AccountLayout,
    roles: ["SUPER_ADMIN"],
  },
  {
    path: "/:companyId/companies",
    element: <SysAdminCompanyPage />,
    layout: AccountLayout,
    roles: ["SUPER_ADMIN"],
  },
  {
    path: "/:companyId/companies/subscription",
    element: <SysAdminCompanySubscriptionPage />,
    layout: AccountLayout,
    roles: ["SUPER_ADMIN"],
  },
  {
    path: "/finance",
    element: <Finance />,
    roles: ["ADMIN", "CONSULTANT"],
    layout: AccountLayout,
  },
  {
    path: "/projects",
    element: <Project />,
    roles: ["ADMIN", "CONSULTANT"],
    layout: AccountLayout,
  },
  {
    path: "/projects/create",
    element: <CreateProjectTemplate />,
    roles: ["ADMIN", "CONSULTANT"],
    layout: AccountLayout,
  },
  {
    path: "/projects/:id",
    element: <ProjectDetailsPageWrapper />,
    roles: ["ADMIN", "CONSULTANT"],
    layout: AccountLayout,
  },
  {
    path: "/admin",
    element: <Admin />,
    roles: ["ADMIN"],
    layout: AccountLayout,
  },
  {
    path: "/admin/pending-invites",
    element: <PendingInvites />,
    roles: ["ADMIN", "SUPER_ADMIN"],
    layout: AccountLayout,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
    roles: ["ADMIN", "CONSULTANT", "SUPER_ADMIN", "CLIENT"],
    layout: AccountLayout,
  },

  //   Profile routes
  {
    path: "/profile-settings",
    element: <EditProfileDetails />,
    roles: ["ADMIN", "CONSULTANT", "SUPER_ADMIN"],
    layout: [ProfilePageLayout, AccountLayout],
  },
  {
    path: "/profile-settings/security",
    element: <ProfileSecurityTemplate />,
    roles: ["ADMIN", "CONSULTANT", "SUPER_ADMIN"],
    layout: [ProfilePageLayout, AccountLayout],
  },
  {
    path: "/profile-settings/organization",
    element: <EditOrganizationDetails />,

    roles: ["ADMIN"],
    layout: [ProfilePageLayout, AccountLayout],
  },
  {
    path: "/404",
    element: <NotFound fullScreen />,
    roles: ["CLIENT", "ADMIN", "CONSULTANT", "SUPER_ADMIN"],
  },
];
