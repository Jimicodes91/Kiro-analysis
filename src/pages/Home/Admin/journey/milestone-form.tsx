import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import useGetAllProjectTypeMilestones, {
  ProjectTypeMilestone,
} from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import useCreateMilestone from "@/hooks/project-modules/milestones/use-create-milestone";
import useUpdateMilestone from "@/hooks/project-modules/milestones/use-update-milestone";
import { addStageSchema } from "@/utils/validation-schema/admin";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";

function MilestoneForm({
  milestone,
  refetch,
  onClose,
  projectTypeId,
}: {
  milestone?: ProjectTypeMilestone;
  refetch: ReturnType<typeof useGetAllProjectTypeMilestones>["refetch"];
  onClose: () => void;
  projectTypeId: string;
}) {
  const setToggleMilestone = milestone ? useUpdateMilestone : useCreateMilestone;
  const toggleMilestone = setToggleMilestone(milestone?.id ?? projectTypeId);

  const form = useForm({
    resolver: yupResolver(addStageSchema),
    defaultValues: {
      name: milestone?.name ?? "",
      duration: `${milestone?.duration ?? ""}`,
    },
  });

  const onSubmit = async (data: InferType<typeof addStageSchema>) => {
    const payload = {
      ...data,
      project_type_id: projectTypeId, // Always include project_type_id
    };

    toggleMilestone
      .mutateAsync(payload)
      .then(() => {
        refetch().finally(() => {
          onClose();
          form.reset();
        });
      })
      .catch(console.error);
  };

  return (
    <>
      <TableRow className="!bg-white !border-y-0">
        <TableCell colSpan={3} className="w-fit bg-transparent hover:bg-transparent">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex gap-3 flex-col md:flex-row"
            >
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-10 w-full max-w-xs"
                          placeholder="Stage name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-10 w-full max-w-xs"
                          placeholder="Duration"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="items-center w-fit gap-2 flex">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={toggleMilestone.isPending}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={toggleMilestone.isPending}>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </TableCell>
      </TableRow>
    </>
  );
}
export default MilestoneForm;
