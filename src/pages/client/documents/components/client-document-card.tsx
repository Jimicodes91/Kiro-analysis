import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, truncateMiddleWords } from "@/lib/utils";
import { IDocument } from "@/types/api.types";
import {
    getDocumentExpiryInfo,
    getExpiryBadgeLabel,
    getExpiryBadgeVariant,
} from "@/utils/document-expiry";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertTriangle,
    Calendar,
    ChevronDown,
    Clock,
    Download,
    FileText,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";

function ExpiryIcon({ status }: { status: string }) {
  if (status === "expired")
    return <AlertTriangle className="size-4 text-[#FB002B]" />;
  if (status === "approaching")
    return <Clock className="size-4 text-[#B78026]" />;
  return <ShieldCheck className="size-4 text-[#00AA3B]" />;
}

export default function ClientDocumentCard({ document }: { document: IDocument }) {
  const [open, setOpen] = useState(false);
  const expiryInfo = getDocumentExpiryInfo(document);
  const hasExpiryData = Boolean(document.expiry_date || document.does_not_expire);
  const attachmentCount = document?.attachments?.length ?? 0;

  return (
    <div className="bg-white rounded-xl border border-brand-border overflow-hidden transition-shadow hover:shadow-sm">
      {/* Header row — always visible, clickable to expand */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
          <FileText className="size-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm text-primary truncate">
              {document?.name}
            </p>
            {hasExpiryData && (
              <Badge
                variant={getExpiryBadgeVariant(expiryInfo.status) as any}
                size="sm"
              >
                {getExpiryBadgeLabel(expiryInfo.status)}
              </Badge>
            )}
          </div>
          <p className="text-xs text-brand-fade mt-0.5">
            {expiryInfo.status === "no_expiry"
              ? "Does not expire"
              : expiryInfo.label}
            {attachmentCount > 0 && (
              <span className="text-brand-fade">
                {" · "}
                {attachmentCount} file{attachmentCount !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>

        <ChevronDown
          className={cn(
            "size-5 text-brand-fade shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-brand-border pt-4">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-brand-fade font-medium">Added</p>
                  <p className="text-sm text-primary">
                    {document?.created_at
                      ? format(new Date(document.created_at), "dd MMM yyyy")
                      : "—"}
                  </p>
                </div>
                {document.issue_date ? (
                  <div>
                    <p className="text-xs text-brand-fade font-medium">
                      Issue date
                    </p>
                    <p className="text-sm text-primary">
                      {format(new Date(document.issue_date), "dd MMM yyyy")}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Expiry callout */}
              {document.expiry_date && !document.does_not_expire ? (
                <div
                  className={cn(
                    "flex items-center justify-between gap-2 p-3 rounded-lg border",
                    expiryInfo.status === "expired"
                      ? "border-[#FB002B22] bg-[#FB002B0A]"
                      : expiryInfo.status === "approaching"
                        ? "border-[#B7802622] bg-[#FAFAE5]"
                        : "border-[#00AA3B22] bg-[#00AA3B0A]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <ExpiryIcon status={expiryInfo.status} />
                    <span className="text-sm font-medium text-primary">
                      {expiryInfo.label}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-brand-fade">
                    <Calendar className="size-3" />
                    {format(new Date(document.expiry_date), "dd MMM yyyy")}
                  </span>
                </div>
              ) : null}

              {document.does_not_expire ? (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-[#00AA3B22] bg-[#00AA3B0A]">
                  <ShieldCheck className="size-4 text-[#00AA3B]" />
                  <span className="text-sm font-medium text-[#027A48]">
                    This document does not expire
                  </span>
                </div>
              ) : null}

              {/* Description */}
              {document?.description && (
                <div>
                  <p className="text-xs text-brand-fade font-medium">
                    Description
                  </p>
                  <p className="text-sm text-primary">{document.description}</p>
                </div>
              )}

              {/* Attachments */}
              <div className="space-y-2">
                <p className="text-xs text-brand-fade font-medium">
                  Attachment{attachmentCount !== 1 ? "s" : ""}
                </p>
                {attachmentCount === 0 ? (
                  <p className="text-sm text-brand-fade">No files attached</p>
                ) : (
                  <div className="space-y-2">
                    {document.attachments.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-3 rounded-lg border border-brand-border bg-[#F8F8F8]"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="size-4 text-brand-fade shrink-0" />
                          <span className="text-sm text-primary truncate">
                            {truncateMiddleWords(item?.media_url)}
                          </span>
                        </div>
                        <a
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "shrink-0 gap-1"
                          )}
                          href={item?.media_url}
                          download
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download className="size-4" />
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
