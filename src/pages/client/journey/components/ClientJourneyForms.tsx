import { useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, ClipboardList, FileText } from "lucide-react";
import { useCallback, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import NativeFormEmbed from "@/components/nativeforms/NativeFormEmbed";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useCheckSubmission from "@/hooks/nativeforms/use-check-submission";
import useGetFormLinksByProject from "@/hooks/nativeforms/use-get-form-links-by-project";
import { QUERYKEYS } from "@/lib/constants";
import { getUserSession } from "@/services/api.service";
import { ClientJourneyFormsProps, FormLinkResponse } from "@/types/nativeforms.types";

export default function ClientJourneyForms({
  projectId,
  projectTypeId,
  milestoneId,
}: ClientJourneyFormsProps) {
  const { value: formLinksData, isLoading } = useGetFormLinksByProject(projectId);
  const [selectedFormLink, setSelectedFormLink] = useState<FormLinkResponse | null>(null);
  const queryClient = useQueryClient();

  const formLinks: FormLinkResponse[] = formLinksData ?? [];

  // Filter form links that match the current project type or milestone
  const applicableFormLinks = formLinks.filter((link) => {
    const matchesProjectType =
      link.project_type_id && link.project_type_id === projectTypeId;
    const matchesMilestone =
      link.milestone_id && link.milestone_id === milestoneId;
    return matchesProjectType || matchesMilestone;
  });

  // Sort by sort_order ascending, then by created_at ascending as tiebreaker
  const sortedFormLinks = [...applicableFormLinks].sort((a, b) => {
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const handleSubmissionComplete = useCallback(() => {
    // Invalidate the submission check for the selected form link
    if (selectedFormLink) {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.CHECK_NATIVEFORMS_SUBMISSION, selectedFormLink.id, projectId],
      });
    }
    // Close dialog after a brief delay so user can see the success state
    setTimeout(() => {
      setSelectedFormLink(null);
    }, 1500);
  }, [selectedFormLink, projectId, queryClient]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5" />
            Forms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  // If no form links exist for the current context, render nothing
  if (sortedFormLinks.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5" />
            Forms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedFormLinks.map((formLink) => (
            <FormCard
              key={formLink.id}
              formLink={formLink}
              projectId={projectId}
              onClick={() => setSelectedFormLink(formLink)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Dialog for form embed */}
      <Dialog.Root
        open={!!selectedFormLink}
        onOpenChange={(open) => {
          if (!open) setSelectedFormLink(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg border bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {selectedFormLink?.display_name}
            </Dialog.Title>
            {selectedFormLink && (
              <FormEmbedContent
                formLink={selectedFormLink}
                projectId={projectId}
                onSubmissionComplete={handleSubmissionComplete}
              />
            )}
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

/**
 * Individual form card displaying status and submission info
 */
function FormCard({
  formLink,
  projectId,
  onClick,
}: {
  formLink: FormLinkResponse;
  projectId: string;
  onClick: () => void;
}) {
  const { value: submissionCheck, isLoading } = useCheckSubmission(
    formLink.id,
    projectId
  );

  const isCompleted = submissionCheck?.exists === true;

  return (
    <button
      type="button"
      className="w-full text-left"
      onClick={onClick}
      aria-label={`Open form: ${formLink.display_name}`}
    >
      <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            <p className="font-medium text-sm">{formLink.display_name}</p>
            {isCompleted && submissionCheck?.submitted_at && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <CalendarCheck className="h-3 w-3" />
                Submitted{" "}
                {new Date(submissionCheck.submitted_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div>
          {isLoading ? (
            <Badge isLoading variant="default" size="sm" />
          ) : isCompleted ? (
            <Badge variant="completed" size="sm">
              Completed
            </Badge>
          ) : (
            <Badge variant="not_started" size="sm">
              Not Started
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

/**
 * Renders the NativeFormEmbed inside the dialog
 */
function FormEmbedContent({
  formLink,
  projectId,
  onSubmissionComplete,
}: {
  formLink: FormLinkResponse;
  projectId: string;
  onSubmissionComplete: () => void;
}) {
  const user = getUserSession();
  const clientId = user?.id ?? "";

  return (
    <NativeFormEmbed
      formUrl={formLink.form_url}
      clientId={clientId}
      projectId={projectId}
      formLinkId={formLink.id}
      onSubmissionComplete={onSubmissionComplete}
    />
  );
}
