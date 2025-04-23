import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import ProjectEmptyState from "@/pages/projects/components/project-empty-state";
import React, { useEffect } from "react";
import { GoShare } from "react-icons/go";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import ViewToggle from "../../../components/ui/view-toggle";
import ProjectTable from "./components/project-table";
import { useProjectContext } from "./context/project-context";
import BoardLoadingWrapper from "./templates/loading-wrapper";
import ActiveProjectTypeProjectWrapper from "./templates/selected-project-wrapper";

const Project: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewMode = searchParams.get("viewMode") || "table";
  const { activeProjectType, changeActiveProjectType } = useProjectContext();
  const allProjects = useGetAllProjects(activeProjectType);
  const projectTypes = useGetAllProjectTypes();

  const handleTabChange = (value: string) => {
    searchParams.set("viewMode", value?.toLowerCase());
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (projectTypes.isSuccess && projectTypes.value && !activeProjectType) {
      const activeTypeId = projectTypes?.value?.data?.[0]?.id;
      changeActiveProjectType(activeTypeId ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectTypes.isSuccess, projectTypes?.value]);

  if (!projectTypes.isPending && !projectTypes?.value) {
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
    <ActiveProjectTypeProjectWrapper>
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
            <Button
              size="sm"
              variant="outline"
              leftIcon={<HiOutlineAdjustmentsVertical className="text-[#111] w-6 h-6" />}
            >
              Filter
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<GoShare className="text-[#111] w-6 h-6" />}
            >
              Export
            </Button>
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
    </ActiveProjectTypeProjectWrapper>
  );
};

export default Project;
