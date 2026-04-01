import { Button } from "@/components/ui/button";
import useFormPrefill from "@/hooks/forms/use-form-prefill";
import { useCreateFormSubmission } from "@/hooks/forms/use-form-submission";
import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ConditionalRule, evaluateCondition } from "./conditional-evaluator";
import FieldRenderer, { FormFieldDefinition } from "./field-renderer";

interface FormRendererProps {
  templateId: string;
  taskId: string;
  clientId: string;
  projectId: string;
}

export default function FormRenderer({
  templateId, taskId, clientId, projectId,
}: FormRendererProps) {
  // Fetch latest published version
  const { value: versionsData, isLoading: versionsLoading } = useQueryActionHook<any>({
    method: "get",
    endpoint: ENDPOINTS.GET_FORM_VERSIONS(templateId),
    queryKey: [QUERYKEYS.GET_FORM_VERSIONS, templateId],
    enabled: Boolean(templateId),
  });

  const versions: any[] = versionsData?.data ?? [];
  const latestVersion = versions.length > 0
    ? versions.reduce((a: any, b: any) => (a.version_number > b.version_number ? a : b))
    : null;

  const fields: FormFieldDefinition[] = latestVersion?.fields_snapshot ?? [];
  const sortedFields = useMemo(
    () => [...fields].sort((a, b) => a.sort_order - b.sort_order),
    [fields]
  );

  // Fetch pre-fill data
  const { value: prefillData } = useFormPrefill(templateId, clientId, Boolean(templateId && clientId));
  const prefill: Record<string, any> = prefillData?.data ?? {};

  const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm({
    defaultValues: {} as Record<string, any>,
  });

  // Apply pre-fill data
  useEffect(() => {
    if (prefill && Object.keys(prefill).length > 0) {
      Object.entries(prefill).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [prefill, setValue]);

  // Watch all values for conditional evaluation
  const watchedValues = useWatch({ control });

  const createSubmission = useCreateFormSubmission();

  // Determine visible fields based on conditional rules
  const visibleFields = useMemo(() => {
    return sortedFields.filter((f) => {
      if (!f.conditional_rule) return true;
      return evaluateCondition(f.conditional_rule as ConditionalRule, watchedValues ?? {});
    });
  }, [sortedFields, watchedValues]);

  const onSubmit = async (data: Record<string, any>, isDraft: boolean) => {
    // Only include visible field values
    const submissionData: Record<string, any> = {};
    visibleFields.forEach((f) => {
      if (data[f.id] !== undefined) submissionData[f.id] = data[f.id];
    });

    try {
      await createSubmission.mutateAsync({
        template_id: templateId,
        task_id: taskId,
        client_id: clientId,
        project_id: projectId,
        submission_data: submissionData,
        status: isDraft ? "draft" : "submitted",
      } as any);
    } catch (err: any) {
      // Map server validation errors to react-hook-form
      const fieldErrors = err?.response?.data?.data?.errors;
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((fe: any) => {
          setError(fe.field_id, { type: fe.rule_type, message: fe.message });
        });
      }
    }
  };

  if (versionsLoading) return <p className="text-sm text-gray-500 p-4">Loading form...</p>;
  if (!latestVersion) return <p className="text-sm text-gray-400 p-4">No published version available.</p>;

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        {visibleFields.map((f) => (
          <FieldRenderer key={f.id} field={f} control={control}
            error={(errors[f.id]?.message as string) ?? undefined} />
        ))}
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="outline"
          onClick={handleSubmit((data) => onSubmit(data, true))}
          isLoading={createSubmission.isPending}>
          Save Draft
        </Button>
        <Button
          onClick={handleSubmit((data) => onSubmit(data, false))}
          isLoading={createSubmission.isPending}>
          Submit
        </Button>
      </div>
    </div>
  );
}
