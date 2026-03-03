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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
import useAddProjectMember, {
  ProjectMemberType,
} from "@/hooks/project-modules/project-members/use-add-project-member";
import { addTeamSchema } from "@/utils/validation-schema/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../../../../../components/Modal";

const AddTeamModal = ({
  onClose,
  projectId,
  isOpen,
  memberType = "client",
}: {
  projectId: string;
  memberType: ProjectMemberType;
} & ModalProps) => {
  const addProjectMember = useAddProjectMember(projectId);
  const users = useGetCompanyUsers();

  const form = useForm<z.infer<typeof addTeamSchema>>({
    resolver: zodResolver(addTeamSchema),
  });

  const onSubmit = async (data: z.infer<typeof addTeamSchema>) => {
    addProjectMember
      .mutateAsync({
        ...data,
        is_visible_to_client: memberType === "client",
        member_type: memberType,
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
        title={`Add ${memberType} team`}
        closeModal={onClose}
        isOpen={isOpen}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 p-4"
          >
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Name</FormLabel>
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
