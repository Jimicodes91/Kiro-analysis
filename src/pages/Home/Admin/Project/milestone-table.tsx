import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import { addStageSchema } from "@/components/validationSchema/admin";
import useGetAllProjectTypeMilestones from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import useCreateMilestone from "@/hooks/project-modules/milestones/use-create-milestone";
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useDisclosure from "@/hooks/use-disclosure";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { IoIosArrowDown } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { InferType } from "yup";

function MilestoneTable({
  projectType,
  bg,
  isOpen,
}: {
  projectType: ProjectType;
  bg: string;
  isOpen: boolean;
}) {
  const milestone = useGetAllProjectTypeMilestones(projectType.id);
  const createMilestone = useCreateMilestone();
  const { isOpen: isCreateFormOpen, onOpen, onClose } = useDisclosure();
  const form = useForm({
    resolver: yupResolver(addStageSchema),
  });

  const onSubmit = async (data: InferType<typeof addStageSchema>) => {
    createMilestone
      .mutateAsync({
        name: data.stageName,
        duration: data.duration,
        project_type_id: projectType.id,
      })
      .then(() => {
        milestone.refetch().finally(() => {
          form.reset();
          onClose();
        });
      })
      .catch(console.error);
  };

  const renderTableBody = () => {
    if (milestone.isPending)
      return <TableSkeletonRowLoader isSegemented={false} noOfRows={3} length={3} />;

    if (milestone?.value?.data?.length === 0)
      return <EmptyTable message="No milestone found" length={3} />;

    return (
      <>
        <>
          {milestone?.value?.data?.map((milestone) => (
            <TableRow className="">
              <TableCell>{milestone?.name}</TableCell>
              <TableCell>{milestone?.duration}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <IoIosArrowDown />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </>
      </>
    );
  };

  return (
    <>
      {isOpen && (
        <motion.tr
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          layout
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.4 }}
          className={cn("!border-t-0 border-l  border-b border-r origin-top", bg)}
        >
          <motion.td
            className="p-2"
            colSpan={3}
            variants={{
              collapsed: { scale: 0.8, opacity: 0 },
              open: { scale: 1, opacity: 1 },
            }}
            transition={{ duration: 0.4 }}
          >
            <Table>
              <TableHeader className="!border rounded-l-full">
                <TableHead className="w-[55%] lg:w-[58%]">Stage</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-4"></TableHead>
              </TableHeader>
              <>{renderTableBody()}</>
              {isCreateFormOpen && (
                <TableRow className="!bg-white !border-y-0">
                  <TableCell
                    colSpan={3}
                    className="w-fit grid bg-transparent hover:bg-transparent pt-4"
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
                            disabled={createMilestone.isPending}
                            onClick={onClose}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            size="sm"
                            isLoading={createMilestone.isPending}
                          >
                            Save
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="!bg-white !border-t-0">
                <TableCell colSpan={3} className="w-fit">
                  <div className="grid">
                    <div className="items-center gap-3 flex">
                      <Button
                        leftIcon={<LuPlus />}
                        variant="ghost"
                        onClick={onOpen}
                        size="sm"
                        className="px-0 hover:bg-transparent"
                      >
                        Add stage
                      </Button>

                      <Separator className="w-fit" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </Table>
          </motion.td>
        </motion.tr>
      )}
    </>
  );
}
export default MilestoneTable;
