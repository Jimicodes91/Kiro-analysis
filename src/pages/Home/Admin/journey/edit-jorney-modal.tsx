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
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useUpdateProjectTypeDetails from "@/hooks/project-modules/project-types/use-update-project-type-details";
import { editProjectPipelineSchema } from "@/utils/validation-schema/admin";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import Modal from "../../../../components/Modal";

function EditJourneyFormModal({
  onClose,
  isOpen,
  projectType,
}: ModalProps & {
  projectType: ProjectType;
}) {
  const updateProjectTypeDetails = useUpdateProjectTypeDetails(projectType.id);
  const form = useForm({
    resolver: yupResolver(editProjectPipelineSchema),
    defaultValues: {
      name: projectType?.name || "",
    },
  });

  const onSubmitEditJourney = async (
    data: InferType<typeof editProjectPipelineSchema>
  ) => {
    updateProjectTypeDetails
      .mutateAsync(data)
      .then(() => {
        form.reset();
        onClose();
      })
      .catch(console.error);
  };

  return (
    <Modal title="Edit journey" closeModal={() => onClose()} isOpen={isOpen}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitEditJourney)}
          className="flex flex-col gap-6 p-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Journey</FormLabel>
                <FormControl>
                  <Input placeholder="journey name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" isLoading={updateProjectTypeDetails.isPending}>
            Update journey
          </Button>
        </form>
      </Form>
    </Modal>
  );
}

export default EditJourneyFormModal;
