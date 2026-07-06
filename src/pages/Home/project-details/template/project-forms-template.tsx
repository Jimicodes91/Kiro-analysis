import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCircle, Clock, FileText, Send } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useGetFormLinksByProject from "@/hooks/nativeforms/use-get-form-links-by-project";
import useGetSubmissionsByProject from "@/hooks/nativeforms/use-get-submissions-by-project";
import useUpdateFormLinkStatus from "@/hooks/nativeforms/use-update-form-link-status";
import useUpdateSubmissionStatus from "@/hooks/nativeforms/use-update-submission-status";
import { QUERYKEYS } from "@/lib/constants";
import {
    FormLinkResponse,
    FormLinkStatus,
    NativeFormsSubmission,
} from "@/types/nativeforms.types";

interface ProjectFormsSectionProps {
  projectId: string;
  projectTypeId?: string;
}

const STATUS_CONFIG: Record<
  FormLinkStatus,
  { label: string; variant: string; icon: typeof Clock }
> = {
  not_sent: { label: "Not Sent", variant: "not_started", icon: FileText },
  sent: { label: "Sent", variant: "pending", icon: Send },
  awaiting_client: { label: "Awaiting Client", variant: "in_progress", icon: Clock },
  submitted: { label: "Submitted", variant: "success", icon: CheckCircle },
  under_review: { label: "Under Review", variant: "due", icon: Clock },
  completed: { label: "Completed", variant: "completed", icon: CheckCircle },
};

export default function ProjectFormsSection({ projectId, projectTypeId }: ProjectFormsSectionProps) {
  const { value: formLinksData, isLoading: linksLoading } = useGetFormLinksByProject(projectId);
  const { value: submissionsData, isLoading: subsLoading } = useGetSubmissionsByProject(projectId);

  const formLinks: FormLinkResponse[] = Array.isArray(formLinksData)
    ? formLinksData
    : (formLinksData as any)?.data ?? [];

  const submissions: NativeFormsSubmission[] = Array.isArray(submissionsData)
    ? submissionsData
    : (submissionsData as any)?.data ?? [];

  if (linksLoading || subsLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (formLinks.length === 0) {
    return (
      <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
        <p className="text-sm text-brand-fade">No external forms linked to this project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">External Forms (NativeForms)</h3>
        <Badge variant="default" size="sm">
          {formLinks.length} form{formLinks.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-3">
        {formLinks.map((link) => {
          const submission = submissions.find((s) => s.form_link_id === link.id);
          return (
            <FormLinkCard
              key={link.id}
              formLink={link}
              submission={submission}
              projectId={projectId}
            />
          );
        })}
      </div>
    </div>
  );
}

function FormLinkCard({
  formLink,
  submission,
  projectId,
}: {
  formLink: FormLinkResponse;
  submission?: NativeFormsSubmission;
  projectId: string;
}) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const updateStatus = useUpdateFormLinkStatus(formLink.id);
  const updateSubStatus = useUpdateSubmissionStatus(submission?.id ?? "");

  const statusInfo = STATUS_CONFIG[formLink.status] || STATUS_CONFIG.not_sent;
  const StatusIcon = statusInfo.icon;

  const handleStatusChange = async (newStatus: FormLinkStatus) => {
    await updateStatus.mutateAsync({ status: newStatus });
    queryClient.invalidateQueries({
      queryKey: [QUERYKEYS.GET_NATIVEFORMS_FORM_LINKS_BY_PROJECT, projectId],
    });
  };

  const handleSubmissionReview = async (newStatus: "under_review" | "completed") => {
    if (!submission) return;
    await updateSubStatus.mutateAsync({ status: newStatus });
    queryClient.invalidateQueries({
      queryKey: [QUERYKEYS.GET_NATIVEFORMS_SUBMISSIONS_BY_PROJECT, projectId],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERYKEYS.GET_NATIVEFORMS_FORM_LINKS_BY_PROJECT, projectId],
    });
  };

  return (
    <Card className="border border-brand-border">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{formLink.display_name}</CardTitle>
          </div>
          <Badge variant={statusInfo.variant as any} size="sm">
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-3">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Form URL: <a href={formLink.form_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{formLink.form_url.slice(0, 50)}...</a></p>
            {submission && (
              <>
                <p>Submitted: {format(new Date(submission.submitted_at), "dd MMM yyyy, h:mm a")}</p>
                {submission.reviewed_at && <p>Reviewed: {format(new Date(submission.reviewed_at), "dd MMM yyyy, h:mm a")}</p>}
              </>
            )}
          </div>

          {/* Status actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {formLink.status === "not_sent" && (
              <Button size="sm" variant="outline" onClick={() => handleStatusChange("sent")}>
                Mark as Sent
              </Button>
            )}
            {formLink.status === "sent" && (
              <Button size="sm" variant="outline" onClick={() => handleStatusChange("awaiting_client")}>
                Awaiting Client
              </Button>
            )}
            {submission && formLink.status === "submitted" && (
              <Button size="sm" variant="outline" onClick={() => handleSubmissionReview("under_review")}>
                Start Review
              </Button>
            )}
            {formLink.status === "under_review" && (
              <Button size="sm" variant="outline" onClick={() => handleSubmissionReview("completed")}>
                Mark Complete
              </Button>
            )}
          </div>

          {/* Submission data preview */}
          {submission && Object.keys(submission.submitted_data).length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-semibold text-gray-600 mb-1">Submitted Data:</p>
              <div className="grid gap-1 text-xs">
                {Object.entries(submission.submitted_data).slice(0, 5).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="font-medium text-gray-500">{key}:</span>
                    <span className="text-gray-700">{String(value)}</span>
                  </div>
                ))}
                {Object.keys(submission.submitted_data).length > 5 && (
                  <p className="text-gray-400 italic">+{Object.keys(submission.submitted_data).length - 5} more fields</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
