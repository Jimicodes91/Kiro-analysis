import { getCookie, setCookie } from "cookies-next";
import React from "react";
import { Outlet } from "react-router-dom";

interface ProjectContextInterface {
  changeActiveProjectType: (projectType: string) => void;
  activeProjectType: string | undefined;
}

const ProjectCtx = React.createContext<ProjectContextInterface>(
  {} as ProjectContextInterface
);

const ProjectContextProvider = () => {
  const storeActiveProjectType = getCookie("active_project");
  const [activeProjectType, setActiveProjectType] = React.useState<string | undefined>(
    storeActiveProjectType as string
  );

  const changeActiveProjectType = (projectType: string) => {
    setActiveProjectType(projectType);
    setCookie("active_project", projectType);
  };

  return (
    <ProjectCtx.Provider
      value={{
        activeProjectType,
        changeActiveProjectType,
      }}
    >
      <Outlet />
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
