import { Admin, Client, Event, Finance, House, Message, Project, Logout } from "../../assets";
import { SidebarLinks } from "../../types";

export const DashboardSidebarLinks: SidebarLinks[] = [

  {
    id: 1,
    title: "Home",
    url: "home",
    image: House,
    headingText: "Home",
  },
  {
    id: 2,
    title: "Project",
    url: "project",
    image: Project,
    headingText: "Project",
  },
  {
    id: 3,
    title: "Client",
    url: "client",
    image: Client,
    headingText: "Client",
  },
  {
    id: 4,
    title: "Event",
    url: "event",
    image: Event,
    headingText: "Event",
  },
  {
    id: 5,
    title: "Message",
    url: "message",
    image: Message,
    headingText: "Message",
  },
  {
    id: 6,
    title: "Finance",
    url: "finance",
    image: Finance,
    headingText: "Finance",
  },
  {
    id: 7,
    title: "Admin",
    url: "admin",
    image: Admin,
    headingText: "Admin",
  },
];

export const DashboardBottomLinks: SidebarLinks[] = [
  {
    id: 1,
    title: "Logout",
    url: "/",
    image: Logout,
    headingText: "Logout",
  },
];
