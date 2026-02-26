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
import { Textarea } from "@/components/ui/textarea";
import useCreateEventType from "@/hooks/project-modules/event-types/use-create-event-type";
import useUpdateEventType from "@/hooks/project-modules/event-types/use-update-event-type";
import { DocumentTypeDetails } from "@/types/api.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import Modal from "../../../../components/Modal";
import { addEventTypeSchema } from "../../../../utils/validation-schema/admin";

const AddEventTypeModal = ({
  onClose,
  isOpen,
  eventType,
}: ModalProps & { eventType?: DocumentTypeDetails }) => {
  const createEvenType = useCreateEventType();
  const updateEvenType = useUpdateEventType(eventType?.id ?? "");
  const isEditMode = !!eventType;
  const toggleEventType = isEditMode ? updateEvenType : createEvenType;

  const form = useForm({
    resolver: yupResolver(addEventTypeSchema),
    defaultValues: {
      description: eventType?.description ?? "",
      name: eventType?.name ?? "",
    },
  });

  const modalText = eventType ? "Edit event type" : "Add event type";
  const onSubmit = async (data: InferType<typeof addEventTypeSchema>) => {
    toggleEventType
      .mutateAsync(data)
      .then(() => {
        form.reset();
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <Modal title={modalText} closeModal={onClose} isOpen={isOpen}>
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
                  <FormLabel isRequired>Type name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" isLoading={toggleEventType.isPending}>
              {modalText}
            </Button>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default AddEventTypeModal;
