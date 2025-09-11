import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Heading from "@/components/ui/heading";
import { IDocument } from "@/types/api.types";
import { format } from "date-fns";
import AttachmentCard from "./attachment";

export default function DocumentCard({
  document,
  isClientView = false,
}: {
  document: IDocument;
  isClientView?: boolean;
}) {
  console.log(document, "document");
  return (
    <div className="bg-[#F8F8F8] rounded-lg border border-brand-border">
      <Accordion collapsible type="single" className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" defaultValue="item-1" className="border-0">
          <AccordionTrigger className="py-3 rounded-lg px-4">
            <Heading size="h5">{document?.name} Documents</Heading>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-4">
              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Date</h3>
                <p className="text-sm text-primary">
                  {format(document?.created_at, "PPP")}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Description</h3>
                <p className="text-sm text-primary">{document?.description ?? "Nill"}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm text-brand-fade font-[500]">Attachment</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {document?.attachments?.map((item) => (
                    <AttachmentCard
                      projectId={document.project_id}
                      attachment={item}
                      key={item.id}
                      isClientView={isClientView}
                    />
                  ))}
                  {document?.attachments?.length === 0 && (
                    <p className="font-bold">No attachment found</p>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
