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
import useCreateDocumentType from "@/hooks/project-modules/document-types/use-create-document-type";
import useUpdateDocumentType from "@/hooks/project-modules/document-types/use-update-document-type";
import { DocumentTypeDetails } from "@/types/api.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import Modal from "../../../../components/Modal";
import { addDocumentTypeSchema } from "../../../../utils/validation-schema/admin";

const AddDocumentModal = ({
  onClose,
  isOpen,
  documentType,
}: ModalProps & { documentType?: DocumentTypeDetails }) => {
  const createDocumentType = useCreateDocumentType();
  const updateDocumentType = useUpdateDocumentType(documentType?.id ?? "");
  const isEditMode = !!documentType;
  const toggleDocumentType = isEditMode ? updateDocumentType : createDocumentType;

  const form = useForm({
    resolver: yupResolver(addDocumentTypeSchema),
    defaultValues: {
      description: documentType?.description ?? "",
      name: documentType?.name ?? "",
    },
  });

  const modalText = isEditMode ? "Edit document type" : "Add document type";
  const onSubmit = async (data: InferType<typeof addDocumentTypeSchema>) => {
    toggleDocumentType
      .mutateAsync(data)
      .then(() => {
        form.reset();
        onClose();
      })
      .catch(console.error);
  };

  return (
    <Modal title={modalText} closeModal={onClose} isOpen={isOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type name</FormLabel>
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" isLoading={toggleDocumentType.isPending}>
            {modalText}
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default AddDocumentModal;
