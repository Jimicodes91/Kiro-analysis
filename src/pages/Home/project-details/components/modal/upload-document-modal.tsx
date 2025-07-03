import Toast from "@/components/Toast";
import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import DragNdrop from "@/components/ui/file-upload";
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
import useUploadDocument from "@/hooks/project-modules/documents/use-upload-document";
import { fileToBase64 } from "@/lib/utils";
import { uploadDocumentSchema } from "@/utils/validation-schema/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../../../../../components/Modal";

const UploadDocumentModal = ({
  onClose,
  projectId,
  isOpen,
}: {
  projectId: string;
} & ModalProps) => {
  const uploadDocument = useUploadDocument(projectId);
  const documentTypes = useGetAllDocumentTypes();
  const form = useForm<z.infer<typeof uploadDocumentSchema>>({
    resolver: zodResolver(uploadDocumentSchema),
  });

  const onSubmit = async (data: z.infer<typeof uploadDocumentSchema>) => {
    const { attachment, ...validData } = data;
    const documentFile = attachment[0];
    let base64File: string | null = null;

    try {
      base64File = await fileToBase64(documentFile);
    } catch (err) {
      console.error("Error converting file:", err);
      base64File = null;
      Toast.error("Invalid file format");
      return;
    }

    uploadDocument
      .mutateAsync({
        ...validData,
        attachment: base64File,
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
        title="Upload document"
        closeModal={onClose}
        isOpen={isOpen}
        closeOnOverlayClick={false}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4"
          >
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
              name="file_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File name</FormLabel>
                  <FormControl>
                    <Input placeholder="Document name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"attachment"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment</FormLabel>
                  <FormControl>
                    <DragNdrop
                      isMulti={false}
                      id={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" isLoading={uploadDocument.isPending}>
              Upload document
            </Button>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default UploadDocumentModal;
