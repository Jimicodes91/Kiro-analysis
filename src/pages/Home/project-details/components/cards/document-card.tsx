import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Heading from "@/components/ui/heading";
import { IDocument } from "@/types/api.types";
import Attachment from "./attachment";

export default function DocumentCard({ document }: { document: IDocument }) {
  return (
    <div className="bg-[#F8F8F8] rounded-lg border border-brand-border">
      <Accordion collapsible type="single" className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" defaultValue="item-1" className="border-0">
          <AccordionTrigger className="py-3 rounded-lg px-4">
            <Heading size="h5">Business registration.doc {document?.name}</Heading>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-4">
              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Date</h3>
                <p className="text-sm text-primary">12 June 2024</p>
              </div>
              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Description</h3>
                <p className="text-sm text-primary">
                  A document is a written or digital file that records information, data,
                  or ideas.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm text-brand-fade font-[500]">Attachment</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <Attachment />
                  <Attachment />
                  <Attachment />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
