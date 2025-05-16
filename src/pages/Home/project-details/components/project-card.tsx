import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getFormattedText } from "@/lib/utils";
import { ProjectDetails } from "@/types/api.types";
import { Heading } from "lucide-react";

export function ProjectSummary({ projectDetails }: { projectDetails: ProjectDetails }) {
  return (
    <div>
      <Accordion collapsible type="single" className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" defaultValue="item-1">
          <AccordionTrigger>
            <div className="flex flex-col gap-1">
              <Heading size="h4" className="leading-[22px]">
                {projectDetails?.name}
              </Heading>
              <p className="text-brand-fade text-sm font-light">
                {projectDetails?.form_data?.client_organization}
              </p>
              <Badge variant={projectDetails?.status}>
                {getFormattedText(projectDetails?.status)}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-3 border border-brand-border rounded-lg p-3">
                <div className="flex justify-between">
                  <p className="text-brand-fade text-sm font-semibold">
                    Phase:
                    <span className="text-[#000] mx-1 text-sm font-semibold">
                      Pre travel
                    </span>
                  </p>

                  <p className="text-[#000] mx-1 text-sm font-semibold">40%</p>
                </div>

                <p className="text-brand-fade text-sm font-semibold">
                  32 days to completion
                </p>
              </div>

              <div className="border-t border-brand-border p-3"></div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
