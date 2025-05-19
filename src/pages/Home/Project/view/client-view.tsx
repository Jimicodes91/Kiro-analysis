import Loader from "@/components/ui/loader";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import ProjectEmptyState from "@/pages/projects/components/project-empty-state";
import { useEffect } from "react";
import ActiveProjectTypeProjectWrapper from "../templates/selected-project-wrapper";
import { useProjectContext } from "./../context/project-context";

const ClientProjectView = () => {
  const { activeProjectType, changeActiveProjectType } = useProjectContext();
  const projectTypes = useGetAllProjectTypes();

  useEffect(() => {
    if (projectTypes.isSuccess && projectTypes.value) {
      const isPresence = projectTypes?.value?.data?.find(
        (item) => item.id === activeProjectType
      )?.id;
      const activeTypeId = projectTypes?.value?.data?.[0]?.id;
      changeActiveProjectType(isPresence ? activeProjectType! : activeTypeId ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectTypes.isSuccess, projectTypes?.value]);

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
    <ActiveProjectTypeProjectWrapper>
      <>
        <div className="flex justify-between gap-3 flex-wrap items-center"></div>
      </>
    </ActiveProjectTypeProjectWrapper>
  );
};

export default ClientProjectView;
