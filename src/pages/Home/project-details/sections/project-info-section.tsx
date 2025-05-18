import Heading from "@/components/ui/heading";
import { ProjectDetails } from "@/types/api.types";
import { ProjectSummary } from "../components/project-sumarry";

const ProjectInfoSection = ({ projectDetails }: { projectDetails: ProjectDetails }) => {
  return (
    <div className="mb-8 p-4 space-y-4 rounded-lg border">
      <div className="flex flex-col gap-1">
        <Heading size="h4" className="leading-[22px]">
          {projectDetails?.name}
        </Heading>
        <p className="text-brand-fade text-sm font-light">
          {projectDetails?.form_data?.client_organization}
        </p>
      </div>

      <div className="bg-[#F8F8F8] p-3 rounded-lg border">
        <h3 className="text-xs mb-1">Description</h3>
        <p className="text-xs text-[#191819B2]">
          {projectDetails?.form_data?.description
            ? projectDetails?.form_data?.description
            : "No description added"}
        </p>
      </div>
      <div className="">
        <ProjectSummary projectDetails={projectDetails} />
      </div>
    </div>
  );
};

export default ProjectInfoSection;
