import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import CustomMultiSelect from "@/components/ui/multi-lol";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useGetAllDocumentTypes from "@/hooks/project-modules/document-types/use-get-all-document-types";
import useCreateDocumentRequest from "@/hooks/project-modules/documents/document-request/use-create-document-request";
import useGetProjectMembers from "@/hooks/project-modules/project-members/use-get-project-members";
import { cn, getSelectableDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../../../../../components/Modal";

export const requestDocumentSchema = z.object({
  name: z.string({
    message: "Document name is required",
  }),
  document_type_id: z.string({
    message: "Document type is required",
  }),
  description: z.string({
    message: "Description is required",
  }),
  end_date: z.date({
    message: "End date is required",
  }),
  is_visible_to_client: z.boolean().default(false),
  assignee_id: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

const RequestDocumentModal = ({
  onClose,
  projectId,
  isOpen,
}: {
  projectId: string;
} & ModalProps) => {
  const createDocumentRequest = useCreateDocumentRequest(projectId);
  const documentTypes = useGetAllDocumentTypes();
  const projectMembers = useGetProjectMembers(projectId);

  const form = useForm<z.infer<typeof requestDocumentSchema>>({
    resolver: zodResolver(requestDocumentSchema),
  });

  const onSubmit = async (data: z.infer<typeof requestDocumentSchema>) => {
    createDocumentRequest
      .mutateAsync({
        ...data,
        assignee_id: data?.assignee_id?.value,
        end_date: formatISO(data.end_date),
      })
      .then(() => {
        form.reset();
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <Modal
        title="Request document"
        closeModal={onClose}
        isOpen={isOpen}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
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
                  <FormLabel>Document type</FormLabel>
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
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>End date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "text-sm h-12 font-normal rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4",
                            !field.value && "text-muted-foreground"
                          )}
                          slotClassName="justify-start"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-brand-placeholder">End date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={getSelectableDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                  <CustomMultiSelect
                    options={
                      projectMembers?.value
                        ? projectMembers?.value?.data?.map((member) => ({
                            label: member?.user?.name ?? member?.user?.email,
                            value: member.user_id,
                          }))
                        : []
                    }
                    isLoading={projectMembers.isPending}
                    onChange={field.onChange}
                    value={field.value}
                    isMulti={undefined}
                    placeholder="Select Assignee"
                  />

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
            <Button type="submit" isLoading={createDocumentRequest.isPending}>
              Send request
            </Button>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default RequestDocumentModal;
