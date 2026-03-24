import { InlineEditable } from "@/components/EditableInput";
import Heading from "@/components/ui/heading";
import useUpdateProject from "@/hooks/project-modules/use-update-project";
import { ProjectDetails } from "@/types/api.types";
import { ProjectSummary } from "../components/project-summary";

const ProjectInfoSection = ({ projectDetails }: { projectDetails: ProjectDetails }) => {
  const updateProject = useUpdateProject(projectDetails?.id);

  return (
    <div className="mb-8 p-4 space-y-4 rounded-lg border">
      <div className="flex flex-col gap-1">
        <Heading size="h4" className="leading-[22px]">
          {projectDetails?.name}
        </Heading>
      </div>

      <div className="bg-[#F8F8F8] p-3 rounded-lg border">
        <h3 className="text-xs mb-1">Description</h3>
        <p className="text-xs text-[#191819B2]"></p>
        <div>
          <InlineEditable
            isTextArea
            isLoading={updateProject?.isPending}
            value={
              projectDetails?.form_data?.description
                ? projectDetails?.form_data?.description
                : "--"
            }
            onChange={(text) => {
              updateProject
                .mutateAsync({
                  ...projectDetails?.form_data,
                  description: text,
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          />
        </div>
      </div>
      <div className="">
        <ProjectSummary projectDetails={projectDetails} />
      </div>
    </div>
  );
};

export default ProjectInfoSection;
