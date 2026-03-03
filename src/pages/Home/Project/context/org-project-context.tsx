import useSwitchOrg from "@/hooks/company-admin/use-switch-org";
import useGetUser from "@/hooks/user/use-get-user";
import { ProjectStatusDict } from "@/lib/constants";
import { getCookie, setCookie } from "cookies-next";
import React, { useEffect } from "react";

interface OrgProjectContextInterface {
  changeActiveProjectType: (projectType: string) => void;
  activeProjectType: string | undefined;
  selectedCompanyId: string | undefined;
  changeSelectedCompanyId: (companyId: string) => void;
  status: ProjectStatusDict | "all";
  changeStatus: (status: ProjectStatusDict | "all") => void;
  search: string;
  handleSearch: (s: string) => void;
  isLoading: boolean;
}

const OrgProjectCtx = React.createContext<OrgProjectContextInterface>(
  {} as OrgProjectContextInterface
);

const OrgProjectContextProvider = ({ children }: { children: React.ReactNode }) => {
  const userData = useGetUser();
  const switchOrg = useSwitchOrg();
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string | undefined>(
    userData?.value?.data?.company_id
  );

  useEffect(() => {
    if (userData?.value?.data?.company_id && !selectedCompanyId) {
      setSelectedCompanyId(userData?.value?.data?.company_id);
    }
  }, [userData?.value?.data?.company_id, selectedCompanyId]);

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

  const changeSelectedCompanyId = (companyId: string) => {
    switchOrg
      .mutateAsync({ companyId })
      .then(() => {
        setCookie("selected_company_id", companyId);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const changeStatus = (status: ProjectStatusDict | "all") => {
    setStatus(status);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  return (
    <OrgProjectCtx.Provider
      value={{
        activeProjectType,
        changeActiveProjectType,
        selectedCompanyId,
        changeSelectedCompanyId,
        status,
        changeStatus,
        search,
        handleSearch,
        isLoading: switchOrg.isPending,
      }}
    >
      {children}
    </OrgProjectCtx.Provider>
  );
};

export const useOrgProjectContext = () => {
  const context = React.useContext(OrgProjectCtx);

  if (context === null) {
    throw new Error("useOrgProject must be used within a OrgProject Provider");
  }
  return context;
};

export default OrgProjectContextProvider;
