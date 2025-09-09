import { getCookie, setCookie } from "cookies-next";
import React from "react";

interface ClientProjectContextInterface {
  changeActiveProjectType: (projectType: string) => void;
  activeProjectType: string | undefined;
  search: string;
  handleSearch: (s: string) => void;
}

const ClientProjectContext = React.createContext<ClientProjectContextInterface>(
  {} as ClientProjectContextInterface
);

const ClientProjectContextProvider = ({ children }: { children: React.ReactNode }) => {
  const storeActiveProjectType = getCookie("active_project");
  const [activeProjectType, setActiveProjectType] = React.useState<string | undefined>(
    storeActiveProjectType as string
  );

  const [search, setSearch] = React.useState("");

  const changeActiveProjectType = (projectType: string) => {
    setActiveProjectType(projectType);
    setCookie("active_project", projectType);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  return (
    <ClientProjectContext.Provider
      value={{
        activeProjectType,
        changeActiveProjectType,
        search,
        handleSearch,
      }}
    >
      {children}
    </ClientProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = React.useContext(ClientProjectContext);

  if (context === null) {
    throw new Error("useProject must be used within a Project Provider");
  }
  return context;
};

export default ClientProjectContextProvider;
