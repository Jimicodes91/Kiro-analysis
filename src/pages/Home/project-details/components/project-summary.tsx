import { InlineEditable } from "@/components/EditableInput";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PersonAvatar from "@/components/ui/person-avatar";
import { ProjectStatusToggler } from "@/components/ui/project-status-toggle";
import useUpdateProject from "@/hooks/project-modules/use-update-project";
import { ProjectDetails } from "@/types/api.types";

export function ProjectSummary({ projectDetails }: { projectDetails: ProjectDetails }) {
  const updateProject = useUpdateProject(projectDetails?.id);
  const clientList = projectDetails?.form_fields?.find(
    (item) => item.slug === "project_client"
  )?.value as { name: string; email: string }[];

  return (
    <div>
      <Accordion collapsible type="single" className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" defaultValue="item-1">
          <AccordionTrigger>Summary</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Project Client</h3>
                <div className="flex items-center -space-x-2">
                  {clientList?.map((item) => (
                    <PersonAvatar key={item.name} name={item.name} email={item.email} />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm text-brand-fade font-[500]">Company</h3>
                <InlineEditable
                  isLoading={updateProject?.isPending}
                  value={projectDetails?.form_data?.client_organization}
                  onChange={(text) => {
                    updateProject
                      .mutateAsync({
                        ...projectDetails?.form_data,
                        client_organization: text,
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm text-brand-fade font-[500]">Project Name</h3>
                <InlineEditable
                  value={projectDetails?.form_data?.project_name}
                  onChange={(text) => {
                    updateProject
                      .mutateAsync({
                        ...projectDetails?.form_data,
                        project_name: text,
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                />
              </div>

              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Status</h3>
                <ProjectStatusToggler
                  projectId={projectDetails.id}
                  status={projectDetails?.status}
                />
              </div>
              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Timeline</h3>
                <p className="text-sm text-gray-900">
                  {projectDetails?.project_timeline}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion collapsible type="single" defaultValue="item-2" className="w-full">
        <AccordionItem value="item-2">
          <AccordionTrigger>Detail</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Client</h3>
                <p className="text-sm text-gray-900">
                  {clientList?.map((client) => client.name)}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm text-brand-fade font-[500]">Project Type</h3>
                <p className="text-sm text-gray-900">
                  {projectDetails?.project_type?.name}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Phase</h3>
                <p className="text-sm text-gray-900">{projectDetails?.milestone?.name}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
