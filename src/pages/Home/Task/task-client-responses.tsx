import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, truncateMiddleWords } from "@/lib/utils";
import { ClientResponse } from "@/types/task.types";
import { CheckCircle2, Circle, Download, FileText } from "lucide-react";

interface TaskClientResponsesProps {
  responses?: ClientResponse[];
}

/**
 * Read-only display of client task responses for the admin/consultant.
 *
 * Renders each response's required item, completion status, submitting client,
 * comment, and a download affordance when a file is present. Handles both a
 * hosted URL reference (Part A) and a legacy base64 value; renders nothing when
 * there are no responses so tasks without them look exactly as before.
 */
const TaskClientResponses = ({ responses }: TaskClientResponsesProps) => {
  if (!Array.isArray(responses) || responses.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Client responses</h3>

      <div className="space-y-3">
        {responses.map((response) => (
          <div
            key={response.id}
            className="rounded-lg border border-gray-200 bg-gray-50/60 p-3 space-y-2"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-800">
                {response.required_item}
              </span>
              <Badge variant={response.is_completed ? "completed" : "pending"} size="sm">
                <span className="inline-flex items-center gap-1">
                  {response.is_completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                  {response.is_completed ? "Completed" : "Pending"}
                </span>
              </Badge>
            </div>

            {response.client?.name ? (
              <p className="text-xs text-gray-500">
                Submitted by {response.client.name}
              </p>
            ) : null}

            {response.comment ? (
              <p className="text-xs text-gray-600 whitespace-pre-wrap">
                {response.comment}
              </p>
            ) : null}

            <ClientResponseFile response={response} />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Resolve how a response's file should be presented. Prefers the backend
 * `file_kind` tag; falls back to inferring from the value for older responses.
 */
const resolveFileKind = (response: ClientResponse): "url" | "base64" | "none" => {
  if (response.file_kind) return response.file_kind;
  if (!response.file_url) return "none";
  return response.file_url.startsWith("http") ? "url" : "base64";
};

const ClientResponseFile = ({ response }: { response: ClientResponse }) => {
  const kind = resolveFileKind(response);
  if (kind === "none" || !response.file_url) return null;

  // Hosted reference — open/download the URL directly.
  if (kind === "url") {
    return (
      <div className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white p-2">
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 truncate">
          <FileText className="w-3.5 h-3.5 shrink-0" />
          {truncateMiddleWords(response.file_url)}
        </span>
        <a
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 gap-1")}
          href={response.file_url}
          download
          target="_blank"
          rel="noreferrer"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      </div>
    );
  }

  // Legacy base64 — build a data URL so it can still be downloaded.
  const dataUrl = response.file_url.startsWith("data:")
    ? response.file_url
    : `data:application/octet-stream;base64,${response.file_url}`;

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white p-2">
      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
        <FileText className="w-3.5 h-3.5 shrink-0" />
        Attached file
      </span>
      <a
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 gap-1")}
        href={dataUrl}
        download={`${response.required_item || "attachment"}`}
      >
        <Download className="w-3.5 h-3.5" />
        Download
      </a>
    </div>
  );
};

export default TaskClientResponses;
