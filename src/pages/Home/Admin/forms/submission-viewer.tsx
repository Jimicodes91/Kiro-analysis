import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { format } from "date-fns";

interface SubmissionViewerProps {
  taskId: string;
}

interface FieldSnapshot {
  id: string;
  type: string;
  label: string;
  options?: string[];
}

export default function SubmissionViewer({ taskId }: SubmissionViewerProps) {
  const { value, isLoading } = useQueryActionHook<any>({
    method: "get",
    endpoint: ENDPOINTS.GET_FORM_SUBMISSIONS_BY_TASK(taskId),
    queryKey: [QUERYKEYS.GET_FORM_SUBMISSIONS_BY_TASK, taskId],
    enabled: Boolean(taskId),
  });

  const submission = value?.data;
  if (isLoading) return <p className="text-sm text-gray-500 p-4">Loading submission...</p>;
  if (!submission) return <p className="text-sm text-gray-400 p-4">No submission found.</p>;

  const data: Record<string, any> = submission.submission_data ?? {};
  const fields: FieldSnapshot[] = submission.fields_snapshot ?? [];
  const sortedFields = [...fields].sort(
    (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return (
    <div className="space-y-4 p-4">
      {/* Metadata */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className={`px-2 py-0.5 rounded font-medium ${
          submission.status === "submitted"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}>
          {submission.status}
        </span>
        {submission.submitted_at && (
          <span>Submitted: {format(new Date(submission.submitted_at), "MMM d, yyyy HH:mm")}</span>
        )}
        <span>Version {submission.version_number}</span>
      </div>

      {/* Field values */}
      <div className="space-y-3">
        {sortedFields.map((f) => {
          const val = data[f.id];
          return (
            <div key={f.id} className="border rounded-lg px-4 py-3 bg-gray-50">
              <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
              <FieldValue type={f.type} value={val} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FieldValue({ type, value }: { type: string; value: any }) {
  if (value === null || value === undefined || value === "") {
    return <p className="text-sm text-gray-400 italic">No response</p>;
  }

  if (type === "file_upload" && typeof value === "string") {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer"
        className="text-sm text-blue-600 underline">
        Download file
      </a>
    );
  }

  if (type === "checkboxes" && Array.isArray(value)) {
    return <p className="text-sm">{value.join(", ")}</p>;
  }

  return <p className="text-sm">{String(value)}</p>;
}
