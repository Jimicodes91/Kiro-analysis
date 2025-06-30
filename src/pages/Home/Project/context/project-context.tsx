import { ProjectStatusDict } from "@/lib/constants";
import { getCookie, setCookie } from "cookies-next";
import React from "react";

interface ProjectContextInterface {
  changeActiveProjectType: (projectType: string) => void;
  activeProjectType: string | undefined;
  status: ProjectStatusDict | "all";
  changeStatus: (status: ProjectStatusDict | "all") => void;
  search: string;
  handleSearch: (s: string) => void;
}

const ProjectCtx = React.createContext<ProjectContextInterface>(
  {} as ProjectContextInterface
);

const ProjectContextProvider = ({ children }: { children: React.ReactNode }) => {
  const storeActiveProjectType = getCookie("active_project");
  const [activeProjectType, setActiveProjectType] = React.useState<string | undefined>(
    storeActiveProjectType as string
  );
  const [status, setStatus] = React.useState<ProjectStatusDict | "all">("all");
  const [search, setSearch] = React.useState("");

  const changeActiveProjectType = (projectType: string) => {
    setActiveProjectType(projectType);
    setCookie("active_project", projectType);
  };

  const changeStatus = (status: ProjectStatusDict | "all") => {
    setStatus(status);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  return (
    <ProjectCtx.Provider
      value={{
        activeProjectType,
        changeActiveProjectType,
        status,
        changeStatus,
        search,
        handleSearch,
      }}
    >
      {children}
    </ProjectCtx.Provider>
  );
};

export const useProjectContext = () => {
  const context = React.useContext(ProjectCtx);

  if (context === null) {
    throw new Error("useProject must be used within a Project Provider");
  }
  return context;
};

export default ProjectContextProvider;
