import { AlertCircle, CheckCircle, Info } from "lucide-react";
import NativeForms from "native-forms-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useCheckSubmission from "@/hooks/nativeforms/use-check-submission";
import { NativeFormEmbedProps } from "@/types/nativeforms.types";

type FormState = "idle" | "loading" | "loaded" | "error" | "timeout" | "submitted";

const LOAD_TIMEOUT_MS = 10_000;

export default function NativeFormEmbed({
  formUrl,
  clientId,
  projectId,
  formLinkId,
  onSubmissionComplete,
}: NativeFormEmbedProps) {
  const [formState, setFormState] = useState<FormState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    value: submissionCheck,
    isLoading: isCheckingSubmission,
    isError: isCheckError,
  } = useCheckSubmission(formLinkId, projectId);

  // Start loading state once submission check completes and no prior submission exists
  useEffect(() => {
    if (isCheckingSubmission || isCheckError) return;
    if (submissionCheck?.exists) return;

    setFormState("loading");

    // Set up 10-second timeout
    timeoutRef.current = setTimeout(() => {
      setFormState((current) => {
        if (current === "loading") return "timeout";
        return current;
      });
    }, LOAD_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isCheckingSubmission, isCheckError, submissionCheck?.exists]);

  // Mark as loaded once the form renders (NativeForms SDK doesn't have an onLoad,
  // so we transition to loaded after a brief delay to allow the iframe to initialize)
  useEffect(() => {
    if (formState !== "loading") return;

    const loadCheck = setTimeout(() => {
      setFormState((current) => {
        if (current === "loading") return "loaded";
        return current;
      });
    }, 1500);

    return () => clearTimeout(loadCheck);
  }, [formState]);

  const handleSubmission = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setFormState("submitted");
    onSubmissionComplete?.();
  }, [onSubmissionComplete]);

  const handleRetry = useCallback(() => {
    setFormState("loading");
    timeoutRef.current = setTimeout(() => {
      setFormState((current) => {
        if (current === "loading") return "timeout";
        return current;
      });
    }, LOAD_TIMEOUT_MS);
  }, []);

  // Show loading skeleton while checking submission status
  if (isCheckingSubmission) {
    return <LoadingSkeleton />;
  }

  // Already completed state
  if (submissionCheck?.exists) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-blue-700 text-base">
            <Info className="h-5 w-5" />
            Already Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600">
            This form has already been completed
            {submissionCheck.submitted_at && (
              <> on {new Date(submissionCheck.submitted_at).toLocaleDateString()}</>
            )}
            .
          </p>
        </CardContent>
      </Card>
    );
  }

  // Error / Timeout state
  if (formState === "error" || formState === "timeout") {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-red-700 text-base">
            <AlertCircle className="h-5 w-5" />
            Form Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-red-600">
            {formState === "timeout"
              ? "The form took too long to load. Please try again."
              : "The form could not be loaded. Please try again later."}
          </p>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Submitted state
  if (formState === "submitted") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-green-700 text-base">
            <CheckCircle className="h-5 w-5" />
            Form Submitted Successfully
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-600">
            Thank you! Your form has been submitted successfully.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Loading / Loaded state — render the form
  return (
    <div className="relative">
      {formState === "loading" && (
        <div className="absolute inset-0 z-10">
          <LoadingSkeleton />
        </div>
      )}
      <div className={formState === "loading" ? "opacity-0" : "opacity-100 transition-opacity duration-300"}>
        <NativeForms
          form={formUrl}
          extraData={{ client_id: clientId, project_id: projectId }}
          onSend={handleSubmission}
        />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-1/3" />
    </div>
  );
}
