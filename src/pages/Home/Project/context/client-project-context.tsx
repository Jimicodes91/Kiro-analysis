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
      if (storeActiveProject) {
        try {
          return typeof storeActiveProject === "string"
            ? JSON.parse(storeActiveProject)
            : undefined;
        } catch {
          return undefined;
        }
      }
      return undefined;
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
      setActiveProject(allProjects?.value?.data?.[0]);
      console.log("Set cookie");
      setCookie(STOREDCOOKIEKEY, allProjects?.value?.data?.[0], {
        httpOnly: true,
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
};

export const useClientProjectContext = () => {
  const context = React.useContext(ClientProjectContext);

  if (context === null) {
    throw new Error("useProject must be used within a Project Provider");
  }
  return context;
};

export default ClientProjectContextProvider;
