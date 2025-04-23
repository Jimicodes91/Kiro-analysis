import Loader from "@/components/ui/loader";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import { useProjectContext } from "@/pages/Home/Project/project-context";
import ProjectEmptyStateCard from "@/pages/projects/components/project-empty-state-card";
import React from "react";
import BoardView from "./board-view";

interface BoardLoadingWrapperProps {
  projectData: ReturnType<typeof useGetAllProjects>;
  projectTypes: ReturnType<typeof useGetAllProjectTypes>;
}

const BoardLoadingWrapper: React.FC<BoardLoadingWrapperProps> = ({
  projectData,
  projectTypes,
}) => {
  const { activeProjectType } = useProjectContext();

  const renderBody = () => {
    if (projectData.isLoading || !activeProjectType)
      return (
        <div className="min-h-[calc(100vh-290px)]">
          <Loader />
        </div>
      );

    if (!projectData.isLoading && projectData?.value) {
      if (projectData?.value?.data?.length === 0) {
        return <ProjectEmptyStateCard />;
      } else {
        const projects = projectData.value.data ?? [];
        return <BoardView projects={projects} projectTypes={projectTypes} />;
      }
    }

    return <p>Some thing went wrong</p>;
  };

  return <>{renderBody()}</>;
};

export default BoardLoadingWrapper;
