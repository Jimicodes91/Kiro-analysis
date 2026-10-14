import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useGetAllProjectDocuments from "@/hooks/project-modules/documents/use-get-all-documents";
import { cn, truncateMiddleWords } from "@/lib/utils";
import { IDocument } from "@/types/api.types";
import {
    ExpiryStatus,
    getDocumentExpiryInfo,
    getExpiryBadgeLabel,
    getExpiryBadgeVariant,
} from "@/utils/document-expiry";
import { format } from "date-fns";
import {
    AlertTriangle,
    Clock,
    Download,
    FileText,
    FileX,
    Search,
    ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

type FilterKey = "all" | ExpiryStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "approaching", label: "Expiring soon" },
  { key: "expired", label: "Expired" },
  { key: "active", label: "Active" },
  { key: "no_expiry", label: "No expiry" },
];

function StatCard({
  label,
  count,
  icon,
  tone,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  tone: "neutral" | "green" | "yellow" | "red";
}) {
  const toneClass = {
    neutral: "bg-primary/5 text-primary",
    green: "bg-[#00AA3B0A] text-[#027A48]",
    yellow: "bg-[#FAFAE5] text-[#B78026]",
    red: "bg-[#FB002B0A] text-[#FB002B]",
  }[tone];

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-border bg-white">
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-lg",
          toneClass
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-primary leading-none">{count}</p>
        <p className="text-xs text-brand-fade mt-1">{label}</p>
      </div>
    </div>
  );
}

/** The expiry date cell content — the hard date plus a relative hint. */
function ExpiryCell({ document }: { document: IDocument }) {
  const info = getDocumentExpiryInfo(document);

  if (info.status === "no_expiry") {
    return (
      <div className="flex flex-col">
        <span className="text-sm text-primary">Does not expire</span>
      </div>
    );
  }

  const toneClass =
    info.status === "expired"
      ? "text-[#FB002B]"
      : info.status === "approaching"
        ? "text-[#B78026]"
        : "text-brand-fade";

  return (
    <div className="flex flex-col">
      <span className="text-sm text-primary">
        {document.expiry_date
          ? format(new Date(document.expiry_date), "dd MMM yyyy")
          : "—"}
      </span>
      <span className={cn("text-xs", toneClass)}>{info.label}</span>
    </div>
  );
}

/** The first download link for a document, or a "no file" hint. */
function DownloadCell({ document }: { document: IDocument }) {
  const attachments = document?.attachments ?? [];

  if (attachments.length === 0) {
    return <span className="text-xs text-brand-fade">No file</span>;
  }

  const primary = attachments[0];
  const extra = attachments.length - 1;

  return (
    <div className="flex items-center gap-2">
      <a
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "shrink-0 gap-1"
        )}
        href={primary?.media_url}
        download
        target="_blank"
        rel="noreferrer"
        title={truncateMiddleWords(primary?.media_url)}
      >
        <Download className="size-4" />
        Download
      </a>
      {extra > 0 && (
        <span className="text-xs text-brand-fade whitespace-nowrap">
          +{extra} more
        </span>
      )}
    </div>
  );
}

/** Status pill reused in both the table and mobile card. */
function StatusPill({ document }: { document: IDocument }) {
  const info = getDocumentExpiryInfo(document);
  return (
    <Badge variant={getExpiryBadgeVariant(info.status) as any} size="sm">
      {getExpiryBadgeLabel(info.status)}
    </Badge>
  );
}

export default function ClientDocumentList({
  projectId,
}: {
  projectId: string;
}) {
  const projectDocs = useGetAllProjectDocuments(projectId);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const documents = useMemo<IDocument[]>(() => {
    const list = projectDocs?.value?.data ?? [];
    // Sort newest first by created date.
    return [...list].sort(
      (a, b) =>
        new Date(b?.created_at ?? 0).getTime() -
        new Date(a?.created_at ?? 0).getTime()
    );
  }, [projectDocs?.value?.data]);

  const stats = useMemo(() => {
    let expiring = 0;
    let expired = 0;
    let valid = 0;
    for (const doc of documents) {
      const status = getDocumentExpiryInfo(doc).status;
      if (status === "approaching") expiring += 1;
      else if (status === "expired") expired += 1;
      else valid += 1; // active + no_expiry
    }
    return { total: documents.length, expiring, expired, valid };
  }, [documents]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesSearch =
        !term ||
        doc.name?.toLowerCase().includes(term) ||
        doc.description?.toLowerCase().includes(term);
      const matchesFilter =
        filter === "all" || getDocumentExpiryInfo(doc).status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [documents, search, filter]);

  if (projectDocs.isPending) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (projectDocs.isError) {
    return (
      <div className="py-12 px-4 rounded-xl border border-brand-border bg-[#F8F8F8] flex flex-col items-center gap-2">
        <AlertTriangle className="size-6 text-[#FB002B]" />
        <p className="text-sm text-brand-fade">
          Something went wrong loading your documents.
        </p>
      </div>
    );
  }

  const emptyState = (
    <div className="py-12 px-4 rounded-xl border border-brand-border bg-[#F8F8F8] flex flex-col items-center gap-2">
      <FileX className="size-6 text-brand-fade" />
      <p className="text-sm text-brand-fade">
        {documents.length === 0
          ? "No documents on this project yet."
          : "No documents match your search."}
      </p>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total documents"
          count={stats.total}
          tone="neutral"
          icon={<FileText className="size-5" />}
        />
        <StatCard
          label="Valid"
          count={stats.valid}
          tone="green"
          icon={<ShieldCheck className="size-5" />}
        />
        <StatCard
          label="Expiring soon"
          count={stats.expiring}
          tone="yellow"
          icon={<Clock className="size-5" />}
        />
        <StatCard
          label="Expired"
          count={stats.expired}
          tone="red"
          icon={<AlertTriangle className="size-5" />}
        />
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-fade" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={cn(
                "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                filter === f.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-brand-border bg-white text-brand-fade hover:bg-gray-50 hover:text-primary"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        emptyState
      ) : (
        <>
          {/* Desktop / tablet: scannable table */}
          <div className="hidden md:block rounded-xl border border-brand-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">File</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="max-w-[380px] whitespace-normal">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                          <FileText className="size-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-primary">
                            {document?.name}
                          </p>
                          {document?.description ? (
                            <p className="text-xs text-brand-fade mt-0.5 line-clamp-2">
                              {document.description}
                            </p>
                          ) : (
                            <p className="text-xs text-brand-fade/60 mt-0.5 italic">
                              No description provided
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusPill document={document} />
                    </TableCell>
                    <TableCell>
                      <ExpiryCell document={document} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DownloadCell document={document} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile: stacked cards (same data, scannable without horizontal scroll) */}
          <div className="md:hidden space-y-3">
            {filtered.map((document) => (
              <div
                key={document.id}
                className="rounded-xl border border-brand-border bg-white p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                      <FileText className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-primary">
                        {document?.name}
                      </p>
                      {document?.description ? (
                        <p className="text-xs text-brand-fade mt-0.5">
                          {document.description}
                        </p>
                      ) : (
                        <p className="text-xs text-brand-fade/60 mt-0.5 italic">
                          No description provided
                        </p>
                      )}
                    </div>
                  </div>
                  <StatusPill document={document} />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1 border-t border-brand-border">
                  <div className="pt-3">
                    <p className="text-xs text-brand-fade font-medium">
                      Expiry
                    </p>
                    <ExpiryCell document={document} />
                  </div>
                  <div className="pt-3">
                    <DownloadCell document={document} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
