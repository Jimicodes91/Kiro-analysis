import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { addStageSchema } from "@/components/validationSchema/admin";
import useGetAllProjectTypeMilestones, {
  ProjectTypeMilestone,
} from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import useUpdateMilestone from "@/hooks/project-modules/milestones/use-update-milestone";
import useDisclosure from "@/hooks/use-disclosure";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";

function MilestoneTableRow({
  milestone,
  refetch,
}: {
  milestone: ProjectTypeMilestone;
  refetch: ReturnType<typeof useGetAllProjectTypeMilestones>["refetch"];
}) {
  const updateMilestone = useUpdateMilestone(milestone.id);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const form = useForm({
    resolver: yupResolver(addStageSchema),
    defaultValues: {
      stageName: milestone.name,
      duration: `${milestone.duration}`,
    },
  });

  const onSubmit = async (data: InferType<typeof addStageSchema>) => {
    updateMilestone
      .mutateAsync({
        name: data.stageName,
        duration: data.duration,
      })
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
      {isOpen ? (
        <TableRow className="!bg-white !border-y-0" key={milestone.name}>
          <TableCell
            colSpan={3}
            className="w-fit bg-transparent hover:bg-transparent pt-4"
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-3 flex-col md:flex-row"
              >
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="stageName"
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
                    disabled={updateMilestone.isPending}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" isLoading={updateMilestone.isPending}>
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow className="">
          <TableCell>{milestone?.name}</TableCell>
          <TableCell>{milestone?.duration}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icons.more />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end" forceMount>
                <DropdownMenuGroup>
                  <>
                    <DropdownMenuItem onClick={onOpen}>Edit Milestone</DropdownMenuItem>
                  </>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
export default MilestoneTableRow;
