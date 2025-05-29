import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import getInitials, { getFormattedText } from "@/lib/utils";
import { ProjectDetails } from "@/types/api.types";

export function ProjectSummary({ projectDetails }: { projectDetails: ProjectDetails }) {
  const clientList = projectDetails?.form_fields?.find(
    (item) => item.slug === "project_client"
  )?.value as { name: string }[];

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
                    <div
                      key={item.name}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F1F1F1] text-dark text-xs font-medium ring-2 ring-white"
                    >
                      {getInitials(item.name)}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Company</h3>
                <p className="text-sm text-gray-900">
                  {projectDetails?.form_data?.client_organization}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Status</h3>
                <Badge variant={projectDetails?.status}>
                  {getFormattedText(projectDetails?.status)}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Timeline</h3>
                <p className="text-sm text-gray-900">{projectDetails?.timeline}</p>
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
                <p className="text-sm text-gray-900">Uchenna Okenwa</p>
              </div>
              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Project Type</h3>
                <p className="text-sm text-gray-900">
                  {projectDetails?.project_type?.name}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Assignee</h3>
                <div className="flex -space-x-2">
                  {["Johnbosco", "Nene", "Temi"]?.map((member) => (
                    <div
                      key={member}
                      className="inline-flex items-center justify-center mt-2 w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-sm font-medium ring-2 ring-white"
                    >
                      {getInitials(member)}
                    </div>
                  ))}
                </div>
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
