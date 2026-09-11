import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Heading from "@/components/ui/heading";
import { safeFormatDate } from "@/lib/utils";
import { IDocument } from "@/types/api.types";
import {
    getDocumentExpiryInfo,
    getExpiryBadgeLabel,
    getExpiryBadgeVariant,
} from "@/utils/document-expiry";
import { AlertTriangle, Calendar, Clock, ShieldCheck } from "lucide-react";
import AttachmentCard from "./attachment";

export default function DocumentCard({
  document,
  isClientView = false,
}: {
  document: IDocument;
  isClientView?: boolean;
}) {
  const expiryInfo = getDocumentExpiryInfo(document);

  return (
    <div className="bg-[#F8F8F8] rounded-lg border border-brand-border">
      <Accordion collapsible type="single" className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" defaultValue="item-1" className="border-0">
          <AccordionTrigger className="py-3 rounded-lg px-4">
            <div className="flex items-center gap-3 flex-1">
              <Heading size="h5">{document?.name}</Heading>
              {/* Expiry badge */}
              {document.expiry_date || document.does_not_expire ? (
                <Badge
                  variant={getExpiryBadgeVariant(expiryInfo.status) as any}
                  size="sm"
                >
                  {getExpiryBadgeLabel(expiryInfo.status)}
                </Badge>
              ) : null}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-4">
              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Date</h3>
                <p className="text-sm text-primary">
                  {safeFormatDate(document?.created_at, "PPP", "—")}
                </p>
              </div>

              {/* Expiry information */}
              {document.expiry_date && !document.does_not_expire ? (
                <div className="flex flex-col gap-2 p-3 rounded-lg border bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {expiryInfo.status === "expired" ? (
                        <AlertTriangle className="size-4 text-red-500" />
                      ) : expiryInfo.status === "approaching" ? (
                        <Clock className="size-4 text-yellow-500" />
                      ) : (
                        <ShieldCheck className="size-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium">{expiryInfo.label}</span>
                    </div>
                    <Badge
                      variant={getExpiryBadgeVariant(expiryInfo.status) as any}
                      size="sm"
                    >
                      {getExpiryBadgeLabel(expiryInfo.status)}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {document.issue_date ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        Issue: <span className="font-semibold text-foreground">{safeFormatDate(document.issue_date, "dd MMM yyyy")}</span>
                      </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      Expiry: <span className="font-semibold text-foreground">{safeFormatDate(document.expiry_date, "dd MMM yyyy")}</span>
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Does not expire */}
              {document.does_not_expire ? (
                <div className="flex items-center gap-2 p-3 rounded-lg border bg-white">
                  <ShieldCheck className="size-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700">Does not expire</span>
                </div>
              ) : null}

              <div>
                <h3 className="text-sm text-brand-fade font-[500]">Description</h3>
                <p className="text-sm text-primary">{document?.description || "No description"}</p>
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
