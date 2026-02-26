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
import useCreateNoteType from "@/hooks/project-modules/note-types/use-create-note-types";
import useUpdateNoteType from "@/hooks/project-modules/note-types/use-update-note-types";
import { TaskTypeDetails } from "@/types/api.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import Modal from "../../../../components/Modal";
import { addEventTypeSchema } from "../../../../utils/validation-schema/admin";

const AddNoteTypeModal = ({
  onClose,
  isOpen,
  noteType,
}: ModalProps & { noteType?: TaskTypeDetails }) => {
  const createNoteType = useCreateNoteType();
  const updateNoteType = useUpdateNoteType(noteType?.id ?? "");
  const isEditMode = !!noteType;
  const toggleNoteType = isEditMode ? updateNoteType : createNoteType;

  const form = useForm({
    resolver: yupResolver(addEventTypeSchema),
    defaultValues: {
      description: noteType?.description ?? "",
      name: noteType?.name ?? "",
    },
  });

  const modalText = noteType ? "Edit note type" : "Add note type";
  const onSubmit = async (data: InferType<typeof addEventTypeSchema>) => {
    toggleNoteType
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

            <Button type="submit" isLoading={toggleNoteType.isPending}>
              {modalText}
            </Button>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default AddNoteTypeModal;
