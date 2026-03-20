import Loader from "@/components/ui/loader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import useDebounce from "@/hooks/use-debounce";
import { projectStatusList } from "@/lib/constants";
import ProjectEmptyState from "@/pages/projects/components/project-empty-state";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ViewToggle from "../../../../components/ui/view-toggle";
import { useOrgProjectContext } from "../context/org-project-context";
import BoardLoadingWrapper from "../templates/loading-wrapper";
import ActiveProjectTypeProjectWrapperOnAdminView from "../templates/selected-project-wrapper-admin";
import ProjectTable from "./../components/project-table";

const NonClientProjectView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewMode = searchParams.get("viewMode") || "board";
  const { activeProjectType, changeActiveProjectType, changeStatus, status, search } =
    useOrgProjectContext();
  const debounceSearch = useDebounce(search, 1000);

  const projectTypes = useGetAllProjectTypes();

  const safeProjectType = useMemo(() => {
    if (!projectTypes.isSuccess) return undefined;
    const types = projectTypes?.value?.data ?? [];
    if (types.length === 0) return undefined;
    return types.find((t) => t.id === activeProjectType)?.id ?? types[0]?.id;
  }, [projectTypes.isSuccess, projectTypes?.value?.data, activeProjectType]);

  const allProjects = useGetAllProjects(safeProjectType, status, debounceSearch);

  const handleTabChange = (value: string) => {
    searchParams.set("viewMode", value?.toLowerCase());
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (projectTypes.isSuccess && projectTypes.value) {
      const types = projectTypes?.value?.data ?? [];
      if (types.length === 0) {
        if (changeActiveProjectType) changeActiveProjectType("");
        return;
      }
      const isPresence = types.find(
        (item) => item.id === activeProjectType
      )?.id;
      const activeTypeId = types[0]?.id;
      if (changeActiveProjectType) {
        changeActiveProjectType(isPresence ? activeProjectType! : activeTypeId ?? "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectTypes.isSuccess, projectTypes?.value, changeActiveProjectType]);

  if (projectTypes.isPending && !projectTypes.value) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (
    !projectTypes.isPending &&
    !!projectTypes?.value &&
    projectTypes?.value?.data?.length === 0
  ) {
    return <ProjectEmptyState />;
  }

  return (
    <ActiveProjectTypeProjectWrapperOnAdminView>
      <>
        {/* Toolbar: view toggle + status filter */}
        <div className="flex justify-between gap-3 flex-wrap items-center mb-4">
          <ViewToggle
            activeTab={viewMode}
            setActiveTab={handleTabChange}
            options={[
              { value: "board", label: "Board" },
              { value: "table", label: "Table" },
            ]}
          />
          <Select value={status} onValueChange={changeStatus}>
            <SelectTrigger className="min-w-[150px] h-9 text-sm">
              <SelectValue placeholder="Select status" className="capitalize" />
            </SelectTrigger>
            <SelectContent>
              {projectStatusList?.map((item) => (
                <SelectItem
                  className="capitalize text-sm"
                  key={item.value}
                  value={`${item.value}`}
                >
                  {item.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Board or Table view */}
        <div className="grid">
          {viewMode === "board" ? (
            <BoardLoadingWrapper projectData={allProjects} projectTypes={projectTypes} />
          ) : (
            <ProjectTable projectData={allProjects} />
          )}
        </div>
      </>
    </ActiveProjectTypeProjectWrapperOnAdminView>
  );
};

export default NonClientProjectView;
