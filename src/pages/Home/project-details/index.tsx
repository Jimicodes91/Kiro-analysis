import useGetProjectDetails from "@/hooks/project-modules/use-get-project-details";
import { useParams } from "react-router-dom";
import ProjectDetailSkeleton from "./components/project-skeleton";
import ProjectDetail from "./main";

function ProjectDetailsPageWrapper() {
  const { id } = useParams<{ id: string }>();
  const projectDetails = useGetProjectDetails(id as string);

  const renderBody = () => {
    if (projectDetails.isSuccess && projectDetails.value) {
      return (
        <ProjectDetail
          projectDetails={projectDetails?.value?.data}
          refetchProject={projectDetails?.refetch}
        />
      );
    }

    if (projectDetails.isError && projectDetails.error) {
      return <p>Something went wrong</p>;
    }
    return <ProjectDetailSkeleton />;
  };

  return <>{renderBody()}</>;
}

export default ProjectDetailsPageWrapper;
