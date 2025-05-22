import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import getInitials, { getFormattedText } from "@/lib/utils";
import { ProjectDetails } from "@/types/api.types";

export function ClientProjectCard({
  projectDetails,
}: {
  projectDetails: ProjectDetails;
}) {
  return (
    <div>
      <Accordion
        collapsible
        type="single"
        className="w-full border border-brand-border rounded-lg"
        defaultValue=""
      >
        <AccordionItem value="item-1" defaultValue="item-1" className="border-0">
          <AccordionTrigger className="px-4">
            <div className="flex flex-col gap-2">
              <Heading size="h4" className="leading-[22px]">
                {projectDetails?.name}
              </Heading>
              <p className="text-brand-fade text-sm font-medium">
                {projectDetails?.form_data?.client_organization}
              </p>
              <Badge variant={projectDetails?.status} className="w-fit">
                {getFormattedText(projectDetails?.status)}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-0">
            <div className="space-y-4">
              <div className="space-y-3 mx-4 border border-brand-border rounded-lg p-3">
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
              <div className="border-t border-brand-border py-2 pt-5">
                <div className="flex justify-between items-center px-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <p>Client team</p>
                      <div className="flex -space-x-2">
                        {["Johnbosco", "Segun", "Nicholas"]?.map((member, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F1F1F1] text-dark text-xs font-medium ring-2 ring-white"
                          >
                            {getInitials(member)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-9 pl-[2px] bg-[#0000001A]"></div>
                    <div className="flex items-center gap-2">
                      <p>Project team</p>
                      <div className="flex -space-x-2">
                        {["Johnbosco", "Segun", "Nicholas"]?.map((member, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F1F1F1] text-dark text-xs font-medium ring-2 ring-white"
                          >
                            {getInitials(member)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      View details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
