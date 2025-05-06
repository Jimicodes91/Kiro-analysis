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
import useCreateTaskType from "@/hooks/project-modules/task-types/use-create-task-types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import Modal from "../../../../components/Modal";
import { addEventTypeSchema } from "../../../../utils/validation-schema/admin";

const AddTaskTypeModal = ({ onClose, isOpen }: ModalProps) => {
  const createTaskType = useCreateTaskType();

  const form = useForm({
    resolver: yupResolver(addEventTypeSchema),
  });

  const onSubmit = async (data: InferType<typeof addEventTypeSchema>) => {
    createTaskType
      .mutateAsync(data)
      .then(() => {
        form.reset();
        onClose();
      })
      .catch(console.log);
  };

  return (
    <>
      <Modal title="Add task type" closeModal={onClose} isOpen={isOpen}>
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

            <Button type="submit" isLoading={createTaskType.isPending}>
              Add task type
            </Button>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default AddTaskTypeModal;
