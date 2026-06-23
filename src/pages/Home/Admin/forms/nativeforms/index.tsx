import { Button } from "@/components/ui/button";
import { QUERYKEYS } from "@/lib/constants";
import { FormLinkResponse } from "@/types/nativeforms.types";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import FormLinkDialog from "./FormLinkDialog";
import FormLinkTable from "./FormLinkTable";

export default function AdminFormLinkConfig() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFormLink, setEditingFormLink] = useState<FormLinkResponse | null>(null);

  const handleCreate = () => {
    setEditingFormLink(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (formLink: FormLinkResponse) => {
    setEditingFormLink(formLink);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false);
      setEditingFormLink(null);
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [QUERYKEYS.GET_NATIVEFORMS_FORM_LINKS],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">External Form Links</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage NativeForms links associated with project types and milestones.
          </p>
        </div>
        <Button onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
          Create Form Link
        </Button>
      </div>

      <FormLinkTable onEdit={handleEdit} />

      <FormLinkDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        editingFormLink={editingFormLink}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
