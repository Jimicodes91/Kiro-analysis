import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useCreateFormLink from "@/hooks/nativeforms/use-create-form-link";
import useUpdateFormLink from "@/hooks/nativeforms/use-update-form-link";
import useGetAllProjectTypeMilestones from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import { FormLinkResponse } from "@/types/nativeforms.types";
import {
    FormLinkFormData,
    formLinkSchema,
} from "@/utils/nativeforms-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFormLink?: FormLinkResponse | null;
  onSuccess?: () => void;
}

function FormLinkDialog({
  open,
  onOpenChange,
  editingFormLink,
  onSuccess,
}: FormLinkDialogProps) {
  const isEditMode = Boolean(editingFormLink);

  const createFormLink = useCreateFormLink();
  const updateFormLink = useUpdateFormLink(editingFormLink?.id ?? "");

  const projectTypes = useGetAllProjectTypes();
  const projectTypesList = projectTypes?.value?.data ?? [];

  const form = useForm<FormLinkFormData>({
    resolver: zodResolver(formLinkSchema),
    defaultValues: {
      form_url: "",
      display_name: "",
      project_type_id: undefined,
      milestone_id: undefined,
      sort_order: 0,
    },
  });

  const selectedProjectTypeId = form.watch("project_type_id");

  const milestones = useGetAllProjectTypeMilestones(
    selectedProjectTypeId ?? ""
  );
  const milestonesList = milestones?.value?.data ?? [];

  // Pre-fill form in edit mode
  useEffect(() => {
    if (editingFormLink) {
      form.reset({
        form_url: editingFormLink.form_url,
        display_name: editingFormLink.display_name,
        project_type_id: editingFormLink.project_type_id ?? undefined,
        milestone_id: editingFormLink.milestone_id ?? undefined,
        sort_order: editingFormLink.sort_order ?? 0,
      });
    } else {
      form.reset({
        form_url: "",
        display_name: "",
        project_type_id: undefined,
        milestone_id: undefined,
        sort_order: 0,
      });
    }
  }, [editingFormLink, form]);

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (data: FormLinkFormData) => {
    const payload = {
      form_url: data.form_url,
      display_name: data.display_name,
      project_type_id: data.project_type_id,
      milestone_id: data.milestone_id,
      sort_order: data.sort_order,
    };

    if (isEditMode) {
      updateFormLink
        .mutateAsync(payload)
        .then(() => {
          handleClose();
          onSuccess?.();
        });
    } else {
      createFormLink.mutateAsync(payload).then(() => {
        handleClose();
        onSuccess?.();
      });
    }
  };

  const isSubmitting = createFormLink.isPending || updateFormLink.isPending;

  return (
    <Modal
      title={isEditMode ? "Edit Form Link" : "Create Form Link"}
      closeModal={handleClose}
      isOpen={open}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-4 space-y-4"
        >
          <FormField
            control={form.control}
            name="form_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Form URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://nativeforms.com/your-form"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter display name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger
                      isLoading={projectTypes.isLoading}
                    >
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectTypesList.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="milestone_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Milestone</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                  disabled={!selectedProjectTypeId}
                >
                  <FormControl>
                    <SelectTrigger
                      isLoading={milestones.isLoading}
                    >
                      <SelectValue
                        placeholder={
                          selectedProjectTypeId
                            ? "Select milestone"
                            : "Select a project type first"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {milestonesList.map((milestone) => (
                      <SelectItem key={milestone.id} value={milestone.id}>
                        {milestone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    placeholder="0"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 border-t">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Form Link"
                  : "Create Form Link"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

export default FormLinkDialog;
