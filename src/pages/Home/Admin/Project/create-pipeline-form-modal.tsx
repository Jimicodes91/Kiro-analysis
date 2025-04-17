import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  ModalProps,
} from "@/components/ui/alert-dialog";
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
import { addProjectPipelineSchema } from "@/components/validationSchema/admin";
import useCreateProjectType from "@/hooks/project-modules/project-types/use-create-project-type";
import { getUserSession } from "@/services/api.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
interface ProjectPipelineFormData {
  pipelineName: string;
}

function CreatePipelineModal({ isOpen, onClose }: ModalProps) {
  const form = useForm<ProjectPipelineFormData>({
    resolver: yupResolver(addProjectPipelineSchema),
  });
  const createProjectType = useCreateProjectType();
  const session = getUserSession();

  const onSubmit = async (data: InferType<typeof addProjectPipelineSchema>) => {
    createProjectType
      .mutateAsync({
        name: data.pipelineName,
        company_id: session?.company_id ?? "",
      })
      .then(() => {
        form.reset();
        onClose();
      })
      .catch(console.error);
  };
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        onEscapeKeyDown={onClose}
        className="bg-white p-3 space-y-1 translate-x-[0%] left-[60%] max-w-xl max-h-[800px] overflow-y-scroll"
      >
        <AlertDialogHeader className="px-3 pt-2">
          <AlertDialogTitle>Create pipeline</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-3 p-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pipelineName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pipeline name</FormLabel>
                    <FormControl>
                      <Input placeholder="Pipeline name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Button
                  type="submit"
                  fullWidth={true}
                  isLoading={createProjectType.isPending}
                >
                  Create Pipeline
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreatePipelineModal;
