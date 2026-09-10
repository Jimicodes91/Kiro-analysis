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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useGetAllDocumentTypes from "@/hooks/project-modules/document-types/use-get-all-document-types";
import useUploadDocument from "@/hooks/project-modules/documents/use-upload-document";
import { fileToBase64 } from "@/lib/utils";
import { isExpiryRequired } from "@/utils/document-expiry";
import { uploadDocumentSchema } from "@/utils/validation-schema/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
  const form = useForm<z.infer<typeof uploadDocumentSchema> & {
    issue_date?: string;
    expiry_date?: string;
    does_not_expire?: boolean;
  }>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      does_not_expire: false,
    },
  });

  const doesNotExpire = useWatch({ control: form.control, name: "does_not_expire" });
  const documentTypeId = useWatch({ control: form.control, name: "document_type_id" });

  const onSubmit = async (data: any) => {
    const { attachment, issue_date, expiry_date, does_not_expire, ...validData } = data;

    // Enforce expiry requirement for document types that require it (Req 2.1–2.4)
    const selectedType = documentTypes?.value?.data?.find(
      (item) => item.id === documentTypeId
    );
    if (isExpiryRequired(selectedType, does_not_expire) && !expiry_date) {
      form.setError("expiry_date", {
        type: "manual",
        message: "Expiry date is required for this document type",
      });
      Toast.error("Expiry date is required for this document type");
      return;
    }

    const documentFile = attachment[0];
    let base64File: string | null = null;

    try {
      base64File = await fileToBase64(documentFile);
      // Strip data URL prefix — backend expects pure base64
      if (base64File.includes(",")) {
        base64File = base64File.split(",")[1];
      }
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
        issue_date: issue_date || null,
        expiry_date: does_not_expire ? null : expiry_date || null,
        does_not_expire: does_not_expire || false,
        is_visible_to_client: true,
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
              name="file_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Document name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. International Passport" {...field} />
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
                    <Textarea
                      placeholder="Short description explaining what the document is or what it is required for"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document Expiry Section */}
            <div className="border rounded-lg p-3 space-y-3 bg-gray-50/50">
              <p className="text-sm font-medium">Document Validity</p>

              {/* Does not expire toggle */}
              <FormField
                control={form.control}
                name="does_not_expire"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="text-sm text-muted-foreground">
                      This document does not expire
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Date fields — hidden when "does not expire" is checked */}
              {!doesNotExpire && (
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="issue_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Issue Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiry_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name={"attachment"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Attachment</FormLabel>
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
