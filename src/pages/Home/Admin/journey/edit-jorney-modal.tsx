import Toast from "@/components/Toast";
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
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import useGetAllProjectTypeMilestones, {
    ProjectTypeMilestone,
} from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useUpdateProjectTypeDetails from "@/hooks/project-modules/project-types/use-update-project-type-details";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { secureRequest } from "@/services/api.service";
import { editJourneyUnifiedSchema } from "@/utils/validation-schema/admin";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { GripVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { LuPlus, LuTrash } from "react-icons/lu";
import { InferType } from "yup";
import Modal from "../../../../components/Modal";

interface MilestoneSnapshot {
  id: string;
  name: string;
  duration: number;
  is_system: number;
}

interface MilestoneFormItem {
  id?: string;
  name: string;
  duration: number;
  is_system?: number;
  _isNew?: boolean;
}

function computeDiff(
  originalName: string,
  formValues: InferType<typeof editJourneyUnifiedSchema>,
  snapshot: MilestoneSnapshot[],
  projectTypeId: string
) {
  const shouldUpdateName = formValues.name.trim() !== originalName;
  const milestonesToCreate: { name: string; duration: number; project_type_id: string }[] = [];
  const milestonesToUpdate: { id: string; name: string; duration: number }[] = [];
  const currentIds = new Set<string>();

  for (const m of formValues.milestones ?? []) {
    const fm = m as MilestoneFormItem;
    if (fm._isNew || !fm.id) {
      milestonesToCreate.push({ name: fm.name, duration: fm.duration, project_type_id: projectTypeId });
    } else {
      currentIds.add(fm.id);
      const orig = snapshot.find((s) => s.id === fm.id);
      if (orig && orig.is_system !== 1 && (orig.name !== fm.name || Number(orig.duration) !== Number(fm.duration))) {
        milestonesToUpdate.push({ id: fm.id, name: fm.name, duration: fm.duration });
      }
    }
  }

  const milestonesToDelete = snapshot
    .filter((s) => !currentIds.has(s.id) && s.is_system !== 1)
    .map((s) => s.id);

  // Compute reorder: compare persisted milestone IDs in form order vs snapshot order
  const persistedIdsInFormOrder = (formValues.milestones ?? [])
    .filter((m) => {
      const fm = m as MilestoneFormItem;
      return fm.id && !fm._isNew;
    })
    .map((m) => (m as MilestoneFormItem).id as string);

  const persistedIdsInSnapshotOrder = snapshot.map((s) => s.id);

  const shouldReorder =
    persistedIdsInFormOrder.length === persistedIdsInSnapshotOrder.length &&
    persistedIdsInFormOrder.length > 0 &&
    persistedIdsInFormOrder.some((id, i) => id !== persistedIdsInSnapshotOrder[i]);

  const reorderIds = shouldReorder ? persistedIdsInFormOrder : [];

  return { shouldUpdateName, milestonesToCreate, milestonesToUpdate, milestonesToDelete, shouldReorder, reorderIds };
}

function EditJourneyFormModal({
  onClose,
  isOpen,
  projectType,
}: ModalProps & { projectType: ProjectType }) {
  const queryClient = useQueryClient();
  const getMilestones = useGetAllProjectTypeMilestones(projectType.id);
  const updateProjectType = useUpdateProjectTypeDetails(projectType.id);
  const snapshotRef = useRef<MilestoneSnapshot[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: yupResolver(editJourneyUnifiedSchema),
    defaultValues: {
      name: projectType?.name || "",
      milestones: [] as MilestoneFormItem[],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    name: "milestones",
    control: form.control,
  });

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    move(source.index, destination.index);
  };

  useEffect(() => {
    if (getMilestones.isSuccess && getMilestones.value?.data) {
      const milestones = getMilestones.value.data.map((m: ProjectTypeMilestone) => ({
        id: m.id, name: m.name, duration: m.duration, is_system: m.is_system, _isNew: false,
      }));
      snapshotRef.current = getMilestones.value.data.map((m: ProjectTypeMilestone) => ({
        id: m.id, name: m.name, duration: m.duration, is_system: m.is_system,
      }));
      form.reset({ name: projectType.name, milestones });
    }
  }, [getMilestones.isSuccess, getMilestones.value?.data]);

  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

  const onSubmit = async (data: InferType<typeof editJourneyUnifiedSchema>) => {
    setIsSaving(true);
    const diff = computeDiff(projectType.name, data, snapshotRef.current, projectType.id);
    const promises: Promise<unknown>[] = [];

    if (diff.shouldUpdateName) {
      promises.push(updateProjectType.mutateAsync({ name: data.name }));
    }
    for (const m of diff.milestonesToCreate) {
      promises.push(secureRequest({ url: `${baseUrl}/${ENDPOINTS.CREATE_MILESTONE}`, method: "post", body: { ...m, duration: String(m.duration) } }));
    }
    for (const m of diff.milestonesToUpdate) {
      promises.push(secureRequest({ url: `${baseUrl}/${ENDPOINTS.UPDATE_MILESTONE_DETAILS(m.id)}`, method: "patch", body: { name: m.name, duration: String(m.duration) } }));
    }
    for (const id of diff.milestonesToDelete) {
      promises.push(secureRequest({ url: `${baseUrl}/${ENDPOINTS.DELETE_MILESTONE(projectType.id, id)}`, method: "delete" }));
    }

    if (diff.shouldReorder) {
      promises.push(secureRequest({ url: `${baseUrl}/${ENDPOINTS.REORDER_MILESTONES(projectType.id)}`, method: "patch", body: { milestone_ids: diff.reorderIds } }));
    }

    if (promises.length === 0) { setIsSaving(false); onClose(); return; }

    const results = await Promise.allSettled(promises);
    const failed = results.filter((r) => r.status === "rejected");
    queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPES] });
    queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPE_MILESTONES, projectType.id] });
    setIsSaving(false);

    if (failed.length > 0) {
      Toast.error("Some changes failed to save. Please try again.");
    } else {
      Toast.success("Journey updated successfully");
      onClose();
    }
  };

  return (
    <Modal title="Edit journey" closeModal={() => onClose()} isOpen={isOpen}>
      {getMilestones.isPending ? (
        <div className="p-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 p-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Journey</FormLabel>
                  <FormControl>
                    <Input placeholder="Journey name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="milestones">
                {(droppableProvided) => (
                  <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                    {fields.map((item, index) => {
                      const milestone = form.getValues(`milestones.${index}`) as MilestoneFormItem;
                      const isSystem = milestone?.is_system === 1;
                      const canRemove = !isSystem && fields.length > 1;
                      const isDragDisabled = isSystem || fields.length <= 1;

                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id || `new-${index}`}
                          index={index}
                          isDragDisabled={isDragDisabled}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex gap-2 mb-6 ${snapshot.isDragging ? "opacity-75 shadow-lg rounded-md bg-white" : ""}`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className={`flex items-center pt-8 ${isDragDisabled ? "invisible" : "cursor-grab"}`}
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="w-full">
                                <FormField
                                  control={form.control}
                                  name={`milestones.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel isRequired>Stage name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Stage name" {...field} disabled={isSystem} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="w-full">
                                <FormField
                                  control={form.control}
                                  name={`milestones.${index}.duration`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel isRequired>Duration (days)</FormLabel>
                                      <FormControl>
                                        <Input type="number" placeholder="Duration" {...field} disabled={isSystem} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              {canRemove && (
                                <Button onClick={() => remove(index)} size="icon" variant="outline" type="button" className="flex-shrink-0 mt-8">
                                  <LuTrash />
                                </Button>
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
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
                        onClick={() => append({ name: "", duration: 1, _isNew: true } as never)}
                        size="sm"
                        type="button"
                        className="px-0 hover:bg-transparent"
                      >
                        Add stage
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent arrowPadding={4} className="text-white p-2">
                      <p>Add a new milestone to this journey</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator className="w-fit" />
              </div>
            </div>

            <Button type="submit" isLoading={isSaving} disabled={isSaving}>
              Update journey
            </Button>
          </form>
        </Form>
      )}
    </Modal>
  );
}

export default EditJourneyFormModal;
