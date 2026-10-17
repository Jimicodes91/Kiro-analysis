import Heading from "@/components/ui/heading";
import Loader from "@/components/ui/loader";
import useGetClientProjects from "@/hooks/project-modules/use-get-client-projects";
import { LayoutWithoutContext } from "@/layouts/dashboard-layout/client-layout";
import { getUserSession } from "@/services/api.service";
import { ProjectDetails } from "@/types/api.types";
import { deleteCookie, getCookie } from "cookies-next";
import React from "react";
import { useLocation } from "react-router-dom";

interface ClientProjectContextInterface {
  changeActiveProject: (project: ProjectDetails) => void;
  activeProject: ProjectDetails | undefined;
  search: string;
  handleSearch: (s: string) => void;
}

const ClientProjectContext = React.createContext<ClientProjectContextInterface>(
  {} as ClientProjectContextInterface
);

/** Where the chosen project's id is remembered across refreshes. */
const STORED_PROJECT_ID_KEY = "client_active_project_id";

/**
 * The previous version saved the ENTIRE project object in this cookie. A full
 * project (form fields, project type and stages, settings) is often larger than
 * the ~4 KB a browser allows for a cookie, and browsers drop an oversized cookie
 * silently, so the client's choice was lost on refresh and they landed back on
 * the default project. We now save only the id; this cookie is read once so
 * existing users keep their selection, then removed.
 */
const LEGACY_COOKIE_KEY = "client_active_project";

function readStoredProjectId(): string | undefined {
  try {
    const id = window.localStorage.getItem(STORED_PROJECT_ID_KEY);
    if (id) return id;
  } catch {
    // Storage unavailable (e.g. blocked in private mode): fall through.
  }

  // One-time migration from the old cookie.
  try {
    const legacy = getCookie(LEGACY_COOKIE_KEY);
    if (typeof legacy === "string" && legacy) {
      const parsed = JSON.parse(legacy) as { id?: unknown };
      return typeof parsed?.id === "string" && parsed.id ? parsed.id : undefined;
    }
  } catch {
    // Corrupt or non-JSON legacy value: ignore it.
  }
  return undefined;
}

function writeStoredProjectId(id: string) {
  try {
    window.localStorage.setItem(STORED_PROJECT_ID_KEY, id);
  } catch {
    // Storage unavailable: the choice still works for this session.
  }
}

const ClientProjectContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedId, setSelectedId] = React.useState<string | undefined>(readStoredProjectId);
  const [search, setSearch] = React.useState("");

  const user = getUserSession();
  const { pathname } = useLocation();
  const allProjects = useGetClientProjects(user?.id ?? "");
  const projects = allProjects?.value?.data;

  // The active project is always resolved from the latest project list, never
  // from a saved copy, so it can't be stale (e.g. after staff move it to a new
  // milestone). If the saved id is missing or no longer assigned to this client,
  // fall back to their first project.
  const activeProject = React.useMemo(() => {
    if (!projects?.length) return undefined;
    return projects.find((p) => p.id === selectedId) ?? projects[0];
  }, [projects, selectedId]);

  // Once we have a valid project, remember it and retire the old oversized cookie.
  React.useEffect(() => {
    if (!activeProject) return;
    writeStoredProjectId(activeProject.id);
    deleteCookie(LEGACY_COOKIE_KEY, { path: "/" });
  }, [activeProject]);

  const changeActiveProject = (project: ProjectDetails) => {
    setSelectedId(project.id);
    writeStoredProjectId(project.id);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  if (allProjects.isLoading && !activeProject) {
    return (
      <LayoutWithoutContext>
        <div className="flex items-center justify-center min-h-[calc(100vh-70px)] ">
          <Loader />
        </div>
      </LayoutWithoutContext>
    );
  }

  if (projects?.length === 0 && !pathname.includes("profile-settings")) {
    return (
      <LayoutWithoutContext>
        <div className="flex items-center justify-center min-h-[calc(100vh-70px)] ">
          <Heading>No project allocated to this user</Heading>
        </div>
      </LayoutWithoutContext>
    );
  }

  if (projects?.length === 0 && pathname.startsWith("/profile-settings")) {
    return <>{children}</>;
  }

  if (activeProject) {
    return (
      <ClientProjectContext.Provider
        value={{
          activeProject,
          changeActiveProject,
          search,
          handleSearch,
        }}
      >
        {children}
      </ClientProjectContext.Provider>
    );
  }
  return null;
};

export const useClientProjectContext = () => {
  const context = React.useContext(ClientProjectContext);

  if (context === null) {
    throw new Error("useProject must be used within a Project Provider");
  }
  return context;
};

export default ClientProjectContextProvider;
