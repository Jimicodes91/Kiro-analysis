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
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import Modal from "../../../../components/Modal";
import { addDocumentTypeSchema } from "../../../../utils/validation-schema/admin";

const AddDocumentModal = ({ onClose }: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: yupResolver(addDocumentTypeSchema),
  });

  const onSubmit = async (data: InferType<typeof addDocumentTypeSchema>) => {
    setLoading(true);
    try {
      onClose();
    } catch (error) {
      console.error(`${data}`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add document type" closeModal={() => onClose()} fullHeight={false}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
          <FormField
            control={form.control}
            name="typeName"
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

          <Button type="submit" isLoading={loading}>
            Add document type
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default AddDocumentModal;
