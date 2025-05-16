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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
import useAddProjectMember from "@/hooks/project-modules/project-members/use-add-project-member";
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
  const addProjectMember = useAddProjectMember(projectId);
  const users = useGetCompanyUsers();

  const form = useForm<z.infer<typeof addTeamSchema>>({
    resolver: zodResolver(addTeamSchema),
  });

  const onSubmit = async (data: z.infer<typeof addTeamSchema>) => {
    addProjectMember
      .mutateAsync(data)
      .then(() => {
        form.reset();
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <Modal
        title="Add team"
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
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="h-12 w-full">
                      <SelectTrigger
                        isLoading={users.isLoading}
                        disabled={users.isLoading}
                        className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                      >
                        <SelectValue
                          placeholder={<p className="text-brand-placeholder">Team</p>}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users?.value?.data?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user?.name ?? user?.email}
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
            <Button type="submit" isLoading={addProjectMember.isPending}>
              Add team
            </Button>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default AddTeamModal;
