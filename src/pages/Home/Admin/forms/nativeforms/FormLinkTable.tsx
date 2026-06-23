import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import useDeleteFormLink from "@/hooks/nativeforms/use-delete-form-link";
import useGetFormLinks from "@/hooks/nativeforms/use-get-form-links";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import { QUERYKEYS } from "@/lib/constants";
import { FormLinkResponse } from "@/types/nativeforms.types";

interface FormLinkTableProps {
  onEdit: (formLink: FormLinkResponse) => void;
}

function truncateUrl(url: string, maxLength = 40): string {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength) + "…";
}

export default function FormLinkTable({ onEdit }: FormLinkTableProps) {
  const queryClient = useQueryClient();
  const { value: formLinksData, isLoading } = useGetFormLinks();
  const { value: projectTypesData } = useGetAllProjectTypes();

  const [deleteTarget, setDeleteTarget] = useState<FormLinkResponse | null>(null);

  const formLinks: FormLinkResponse[] = formLinksData ?? [];
  const projectTypes = projectTypesData?.data ?? [];

  // Build lookup maps for displaying names
  const projectTypeMap = new Map<string, string>(
    projectTypes.map((pt) => [pt.id, pt.name])
  );
  const milestoneMap = new Map<string, string>(
    projectTypes.flatMap((pt) =>
      (pt.milestones ?? []).map((m): [string, string] => [m.id, m.name])
    )
  );

  const getProjectTypeName = (id: string | null): string => {
    if (!id) return "—";
    return projectTypeMap.get(id) ?? "—";
  };

  const getMilestoneName = (id: string | null): string => {
    if (!id) return "—";
    return milestoneMap.get(id) ?? "—";
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!formLinks.length) {
    return (
      <p className="text-sm text-gray-400 py-8 text-center">
        No form links configured yet
      </p>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Display Name</TableHead>
              <TableHead>Form URL</TableHead>
              <TableHead>Project Type</TableHead>
              <TableHead>Milestone</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formLinks.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-medium">
                  {link.display_name}
                </TableCell>
                <TableCell
                  className="text-gray-500"
                  title={link.form_url}
                >
                  {truncateUrl(link.form_url)}
                </TableCell>
                <TableCell>{getProjectTypeName(link.project_type_id)}</TableCell>
                <TableCell>{getMilestoneName(link.milestone_id)}</TableCell>
                <TableCell>{link.sort_order}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(link)}
                    aria-label={`Edit ${link.display_name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setDeleteTarget(link)}
                    aria-label={`Delete ${link.display_name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmDialog
        formLink={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => {
          setDeleteTarget(null);
          queryClient.invalidateQueries({
            queryKey: [QUERYKEYS.GET_NATIVEFORMS_FORM_LINKS],
          });
        }}
      />
    </>
  );
}

function DeleteConfirmDialog({
  formLink,
  onClose,
  onDeleted,
}: {
  formLink: FormLinkResponse | null;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const deleteMutation = useDeleteFormLink(formLink?.id ?? "");

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync({});
      onDeleted();
    } catch {
      // Error toast handled by useCustomMutation
    }
  };

  return (
    <AlertDialog open={!!formLink} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Form Link</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{formLink?.display_name}"? This
            action will remove the form link and clients will no longer see this
            form.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
