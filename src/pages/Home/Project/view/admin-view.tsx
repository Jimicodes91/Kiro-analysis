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
import { useEffect } from "react";
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

  // Only pass activeProjectType to the projects query after project types have loaded
  // and validated the active type. This prevents stale cookie values from triggering 500s.
  const validatedProjectType = projectTypes.isSuccess
    ? projectTypes?.value?.data?.find((t) => t.id === activeProjectType)?.id
    : undefined;

  const allProjects = useGetAllProjects(validatedProjectType, status, debounceSearch);

  const handleTabChange = (value: string) => {
    searchParams.set("viewMode", value?.toLowerCase());
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (projectTypes.isSuccess && projectTypes.value) {
      const types = projectTypes?.value?.data ?? [];
      if (types.length === 0) {
        // No journeys exist — clear any stale cookie
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
      <div className="min-h-[calc(100vh-70px)] flex items-center">
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
        <div className="flex justify-between gap-3 flex-wrap items-center">
          <ViewToggle
            activeTab={viewMode}
            setActiveTab={handleTabChange}
            options={[
              { value: "board", label: "Board" },
              { value: "table", label: "Table" },
            ]}
          />
          <div className="flex justify-between space-x-2">
            <div>
              <Select value={status} onValueChange={changeStatus}>
                <SelectTrigger className="min-w-[150px] h-10">
                  <SelectValue placeholder="Select status" className="capitalize" />
                </SelectTrigger>
                <SelectContent>
                  {projectStatusList?.map((item) => (
                    <SelectItem
                      className="capitalize"
                      key={item.value}
                      value={`${item.value}`}
                    >
                      {item.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-4 grid">
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
