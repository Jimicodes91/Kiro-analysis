import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import useGetSubmissionsByProject from "@/hooks/nativeforms/use-get-submissions-by-project";
import { NativeFormsSubmission } from "@/types/nativeforms.types";

interface SubmissionViewerProps {
  projectId: string;
}

function formatSubmissionDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "dd MMM, yyyy h:mm a");
  } catch {
    return "—";
  }
}

function SubmittedDataView({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">No submitted data available</p>
    );
  }

  return (
    <div className="grid gap-2 py-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-[minmax(120px,_1fr)_2fr] gap-2 text-sm border-b border-gray-100 pb-2 last:border-0"
        >
          <span className="font-medium text-gray-600 break-words">{key}</span>
          <span className="text-gray-800 break-words">
            {value === null || value === undefined
              ? "—"
              : typeof value === "object"
                ? JSON.stringify(value, null, 2)
                : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SubmissionViewer({ projectId }: SubmissionViewerProps) {
  const { value: submissionsData, isLoading, error } = useGetSubmissionsByProject(projectId);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const submissions: NativeFormsSubmission[] = Array.isArray(submissionsData) ? submissionsData : (submissionsData as any)?.data ?? [];

  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Form Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Form Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500 py-4 text-center">
            Failed to load submissions. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!submissions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Form Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 py-8 text-center">
            No submissions yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Form Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <SubmissionRow
                  key={submission.id}
                  submission={submission}
                  isExpanded={expandedRow === submission.id}
                  onToggle={() => toggleRow(submission.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmissionRow({
  submission,
  isExpanded,
  onToggle,
}: {
  submission: NativeFormsSubmission;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <TableCell className="font-medium">
          {submission.display_name || "Untitled Form"}
        </TableCell>
        <TableCell className="text-gray-500">
          {submission.client_id ?? "—"}
        </TableCell>
        <TableCell>{formatSubmissionDate(submission.submitted_at)}</TableCell>
        <TableCell>
          <Badge variant="completed" size="sm">
            Completed
          </Badge>
        </TableCell>
        <TableCell>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="hover:bg-white">
          <TableCell colSpan={5} className="bg-gray-50 p-4">
            <div className="max-w-2xl">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Submitted Data
              </h4>
              <SubmittedDataView data={submission.submitted_data} />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
