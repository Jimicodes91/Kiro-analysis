import { Input } from "@/components/ui/input";
import useGetAllProjectDocuments from "@/hooks/project-modules/documents/use-get-all-documents";
import { cn } from "@/lib/utils";
import { IDocument } from "@/types/api.types";
import { ExpiryStatus, getDocumentExpiryInfo } from "@/utils/document-expiry";
import {
    AlertTriangle,
    Clock,
    FileText,
    FileX,
    Search,
    ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import ClientDocumentCard from "./client-document-card";

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
      <div className={cn("flex size-10 items-center justify-center rounded-lg", toneClass)}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-primary leading-none">{count}</p>
        <p className="text-xs text-brand-fade mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function ClientDocumentList({ projectId }: { projectId: string }) {
  const projectDocs = useGetAllProjectDocuments(projectId);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const documents = useMemo<IDocument[]>(
    () => projectDocs?.value?.data ?? [],
    [projectDocs?.value?.data]
  );

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
            <div key={i} className="h-16 rounded-xl bg-slate-200 animate-pulse" />
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
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-brand-border bg-white text-brand-fade hover:bg-gray-50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-12 px-4 rounded-xl border border-brand-border bg-[#F8F8F8] flex flex-col items-center gap-2">
          <FileX className="size-6 text-brand-fade" />
          <p className="text-sm text-brand-fade">
            {documents.length === 0
              ? "No documents on this project yet."
              : "No documents match your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((document) => (
            <ClientDocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  );
}
