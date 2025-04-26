import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import useGetAllDocumentTypes from "@/hooks/project-modules/document-types/use-get-all-document-types";
import useCreateTask from "@/hooks/project-modules/tasks/use-create-task";
import { requestDocument } from "@/utils/validation-schema/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../../../../../components/Modal";

const statuses = [
  { value: "in_progress", label: "In Progress" },
  { value: "pending", label: "Pending" },
];
const RequestDocumentModal = ({
  onClose,
  projectId,
  isOpen,
}: {
  projectId: string;
} & ModalProps) => {
  const createTask = useCreateTask(projectId);
  const documentTypes = useGetAllDocumentTypes();
  const form = useForm<z.infer<typeof requestDocument>>({
    resolver: zodResolver(requestDocument),
  });

  const onSubmit = async (data: z.infer<typeof requestDocument>) => {
    createTask
      // @ts-expect-error ssls
      .mutateAsync(data)
      .then(() => {
        form.reset();
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <Modal title="Request document" closeModal={onClose} isOpen={isOpen}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document name</FormLabel>
                  <FormControl>
                    <Input placeholder="Document name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="document_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="h-12 w-full">
                      <SelectTrigger
                        isLoading={documentTypes.isLoading}
                        className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                      >
                        <SelectValue
                          placeholder={
                            <p className="text-brand-placeholder">Select Document type</p>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypes?.value?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignee_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="h-12 w-full">
                      <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                        <SelectValue
                          placeholder={
                            <p className="text-brand-placeholder">Select Assignee</p>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses?.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
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
              name="is_visible_to_client"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal text-brand-fade">
                    Make visible to client
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button type="submit" isLoading={createTask.isPending}>
              Send request
            </Button>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default RequestDocumentModal;
