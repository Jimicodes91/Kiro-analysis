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
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useCreateProjectType from "@/hooks/project-modules/project-types/use-create-project-type";
import { getUserSession } from "@/services/api.service";
import { addProjectPipelineSchema } from "@/utils/validation-schema/admin";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { LuPlus, LuTrash } from "react-icons/lu";
import { InferType } from "yup";
import Modal from "../../../../components/Modal";

function PipelineForm({ onClose }: { onClose: () => void }) {
  const session = getUserSession();
  const createProjectType = useCreateProjectType();
  const form = useForm({
    resolver: yupResolver(addProjectPipelineSchema),
    defaultValues: {
      stages: [
        {
          name: "",
          duration: 0,
        },
      ],
    },
  });

  const {
    fields: stagesFields,
    append,
    remove,
  } = useFieldArray({
    name: "stages",
    control: form.control,
    rules: {
      required: "Please append at least 1 item",
      minLength: 1,
    },
  });

  const onSubmitPipeline = async (data: InferType<typeof addProjectPipelineSchema>) => {
    createProjectType
      .mutateAsync({
        company_id: session?.company_id ?? "",
        ...data,
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
            name="name"
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
          {stagesFields.map((item, index) => (
            <div className="flex gap-2 items-center" key={item.id}>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name={`stages.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage name</FormLabel>
                      <FormControl>
                        <Input placeholder="Stage name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name={`stages.${index}.duration`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Duration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {stagesFields.length > 1 && (
                <Button
                  onClick={() => remove(index)}
                  size="icon"
                  variant="outline"
                  className="flex-shrink-0"
                >
                  <LuTrash />
                </Button>
              )}
            </div>
          ))}

          <div className="grid p-0 m-0">
            <div className="items-center gap-3 flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      leftIcon={<LuPlus />}
                      variant="ghost"
                      onClick={() => append({ name: "", duration: 0 })}
                      size="sm"
                      className="px-0 hover:bg-transparent"
                    >
                      Add stage
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent arrowPadding={4} className="text-white p-2">
                    <p>Add the stages/milestons to a project type</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Separator className="w-fit" />
            </div>
          </div>
          <Button type="submit" isLoading={createProjectType.isPending}>
            Create pipeline
          </Button>
        </form>
      </Form>
    </Modal>
  );
}

export default PipelineForm;
