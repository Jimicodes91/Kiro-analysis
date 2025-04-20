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
import useCreateProjectType from "@/hooks/project-modules/project-types/use-create-project-type";
import { getUserSession } from "@/services/api.service";
import { addProjectPipelineSchema } from "@/utils/validation-schema/admin";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import Modal from "../../../../components/Modal";
interface ProjectPipelineFormData {
  pipelineName: string;
}

function PipelineForm({ onClose }: { onClose: () => void }) {
  const session = getUserSession();
  const createProjectType = useCreateProjectType();
  const form = useForm<ProjectPipelineFormData>({
    resolver: yupResolver(addProjectPipelineSchema),
  });

  const onSubmitPipeline = async (data: InferType<typeof addProjectPipelineSchema>) => {
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
    <Modal title="Create pipeline" closeModal={() => onClose()} fullHeight={false}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitPipeline)}
          className="flex flex-col gap-6 p-4"
        >
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
          <Button type="submit" isLoading={createProjectType.isPending}>
            Create pipeline
          </Button>
        </form>
      </Form>
    </Modal>
  );
}

export default PipelineForm;
