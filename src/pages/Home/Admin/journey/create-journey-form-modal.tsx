import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import useGetJourneyTemplates from "@/hooks/project-modules/project-types/use-get-journey-templates";
import { getUserSession } from "@/services/api.service";
import { addProjectPipelineSchema } from "@/utils/validation-schema/admin";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { yupResolver } from "@hookform/resolvers/yup";
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { LuArrowLeft, LuFileText, LuPlus, LuTrash } from "react-icons/lu";
import { InferType } from "yup";
import Modal from "../../../../components/Modal";

type ModalMode = "template-selection" | "form";

function JourneyFormModal({ onClose, isOpen }: ModalProps) {
  const [mode, setMode] = useState<ModalMode>("template-selection");
  const session = getUserSession();
  const createProjectType = useCreateProjectType();
  const { value: templatesResponse } = useGetJourneyTemplates();
  const templates = templatesResponse?.data ?? [];

  const form = useForm({
    resolver: yupResolver(addProjectPipelineSchema),
    defaultValues: {
      stages: [
        {
          name: "",
          duration: 1,
        },
      ],
    },
  });

  const {
    fields: stagesFields,
    append,
    remove,
    move,
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
        setMode("template-selection");
        onClose();
      })
      .catch(console.error);
  };

  const handleSelectTemplate = (template: { name: string; milestones: Array<{ name: string; duration: number }> }) => {
    form.reset({
      name: template.name,
      stages: template.milestones.map(m => ({ name: m.name, duration: m.duration })),
    });
    setMode("form");
  };

  const handleStartFromScratch = () => {
    form.reset({
      name: "",
      stages: [{ name: "", duration: 1 }],
    });
    setMode("form");
  };

  const handleBackToTemplates = () => {
    form.reset({
      name: "",
      stages: [{ name: "", duration: 1 }],
    });
    setMode("template-selection");
  };

  const handleClose = () => {
    form.reset();
    setMode("template-selection");
    onClose();
  };

  return (
    <Modal title="Create journey" closeModal={handleClose} isOpen={isOpen}>
      {mode === "template-selection" ? (
        <div className="flex flex-col gap-4 p-4">
          <p className="text-sm text-muted-foreground">
            Choose a template or start from scratch
          </p>
          <div className="flex flex-col gap-3">
            {templates.map((template) => (
              <Card
                key={template.name}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSelectTemplate(template)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectTemplate(template);
                  }
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {template.milestones.length} milestones
                  </p>
                </CardContent>
              </Card>
            ))}
            <Card
              className="cursor-pointer hover:border-primary transition-colors border-dashed"
              onClick={handleStartFromScratch}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleStartFromScratch();
                }
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <LuFileText className="h-4 w-4" />
                  Start from scratch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Create a blank journey with custom milestones
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div>
          <div className="px-4 pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="px-0 hover:bg-transparent text-muted-foreground"
              onClick={handleBackToTemplates}
            >
              <LuArrowLeft className="h-4 w-4 mr-1" />
              Back to templates
            </Button>
          </div>
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
                    <FormLabel isRequired>Journey</FormLabel>
                    <FormControl>
                      <Input placeholder="journey name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Milestone stages with drag-to-reorder */}
              <DragDropContext onDragEnd={(result: DropResult) => {
                const { source, destination } = result;
                if (!destination || source.index === destination.index) return;
                move(source.index, destination.index);
              }}>
                <Droppable droppableId="create-milestones">
                  {(droppableProvided) => (
                    <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                      {stagesFields.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={stagesFields.length <= 1}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex gap-2 mb-6 ${snapshot.isDragging ? "opacity-75 shadow-lg rounded-md bg-white" : ""}`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className={`flex items-center pt-8 ${stagesFields.length <= 1 ? "invisible" : "cursor-grab"}`}
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="w-full">
                                <FormField
                                  control={form.control}
                                  name={`stages.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel isRequired>Stage Name</FormLabel>
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
                                      <FormLabel isRequired>Duration (Days)</FormLabel>
                                      <FormControl>
                                        <Input type="number" placeholder="Duration" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              {index >= 1 && (
                                <Button
                                  onClick={() => remove(index)}
                                  size="icon"
                                  variant="outline"
                                  type="button"
                                  className="flex-shrink-0 mt-8"
                                >
                                  <LuTrash />
                                </Button>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="grid p-0 m-0">
                <div className="items-center gap-3 flex">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          leftIcon={<LuPlus />}
                          variant="ghost"
                          onClick={() => append({ name: "", duration: 1 })}
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
                Create journey
              </Button>
            </form>
          </Form>
        </div>
      )}
    </Modal>
  );
}

export default JourneyFormModal;
