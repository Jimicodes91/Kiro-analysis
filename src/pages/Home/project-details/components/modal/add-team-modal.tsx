import { ModalProps } from "@/components/ui/alert-dialog";
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
import useGetAllDocumentTypes from "@/hooks/project-modules/document-types/use-get-all-document-types";
import useCreateTask from "@/hooks/project-modules/tasks/use-create-task";
import { addTeamSchema } from "@/utils/validation-schema/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../../../../../components/Modal";

const AddTeamModal = ({
  onClose,
  projectId,
  isOpen,
}: {
  projectId: string;
} & ModalProps) => {
  const createTask = useCreateTask(projectId);
  const documentTypes = useGetAllDocumentTypes();
  const form = useForm<z.infer<typeof addTeamSchema>>({
    resolver: zodResolver(addTeamSchema),
  });

  const onSubmit = async (data: z.infer<typeof addTeamSchema>) => {
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
      <Modal title="Add team" closeModal={onClose} isOpen={isOpen}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="h-12 w-full">
                      <SelectTrigger
                        isLoading={documentTypes.isLoading}
                        className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                      >
                        <SelectValue
                          placeholder={<p className="text-brand-placeholder">Team</p>}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Assign to" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" isLoading={createTask.isPending}>
              Add team
            </Button>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default AddTeamModal;
