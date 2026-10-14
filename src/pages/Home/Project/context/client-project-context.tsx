import Heading from "@/components/ui/heading";
import Loader from "@/components/ui/loader";
import useGetClientProjects from "@/hooks/project-modules/use-get-client-projects";
import { LayoutWithoutContext } from "@/layouts/dashboard-layout/client-layout";
import { getUserSession } from "@/services/api.service";
import { ProjectDetails } from "@/types/api.types";
import { getCookie, setCookie } from "cookies-next";
import React, { useEffect } from "react";
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

const STOREDCOOKIEKEY = "client_active_project";

const ClientProjectContextProvider = ({ children }: { children: React.ReactNode }) => {
  const storeActiveProject = getCookie(STOREDCOOKIEKEY);
  const [activeProject, setActiveProject] = React.useState<ProjectDetails | undefined>(
    () => {
      if (typeof storeActiveProject !== "string") return undefined;
      try {
        const parsed = JSON.parse(storeActiveProject) as ProjectDetails;
        // Only restore a usable project. A legacy/malformed cookie (e.g. a
        // raw object stringified to "[object Object]") parses to something
        // without an id; treat that as empty so the auto-select effect below
        // can repopulate it instead of leaving the client stuck with no
        // active project (which showed empty documents).
        return parsed && parsed.id ? parsed : undefined;
      } catch {
        return undefined;
      }
    }
  );

  const [search, setSearch] = React.useState("");

  const changeActiveProject = (project: ProjectDetails) => {
    setActiveProject(project);
    setCookie(STOREDCOOKIEKEY, JSON.stringify(project));
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const user = getUserSession();
  const { pathname } = useLocation();

  const allProjects = useGetClientProjects(user?.id ?? "");
  useEffect(() => {
    if (allProjects?.value?.data?.length && !activeProject) {
      const firstProject = allProjects.value.data[0];
      setActiveProject(firstProject);
      // Store as a JSON string so it round-trips with the JSON.parse on read.
      // Do NOT set httpOnly: this cookie is both written and read by the
      // client, and an httpOnly cookie is invisible to JS on the next load
      // (which previously left activeProject undefined -> empty project data).
      setCookie(STOREDCOOKIEKEY, JSON.stringify(firstProject), {
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: "strict", // Prevent cross-site scripting attacks
      });
    }
  }, [allProjects?.value, activeProject]);

  if (allProjects.isLoading && !activeProject) {
    return (
      <LayoutWithoutContext>
        <div className="flex items-center justify-center min-h-[calc(100vh-70px)] ">
          <Loader />
        </div>
      </LayoutWithoutContext>
    );
  }

  if (allProjects?.value?.data?.length === 0 && !pathname.includes("profile-settings")) {
    return (
      <LayoutWithoutContext>
        <div className="flex items-center justify-center min-h-[calc(100vh-70px)] ">
          <Heading>No project allocated to this user</Heading>
        </div>
      </LayoutWithoutContext>
    );
  }

  if (
    allProjects?.value?.data?.length === 0 &&
    pathname.startsWith("/profile-settings")
  ) {
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
