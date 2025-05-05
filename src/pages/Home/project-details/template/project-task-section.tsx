import { Button } from "@/components/ui/button";
import useGetProjectTasks from "@/hooks/project-modules/tasks/use-get-project-tasks";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import { Filter, Plus } from "lucide-react";
import TaskCard from "../components/cards/task-card";
import AddProjectTaskModal from "../components/modal/add-project-task-modal";

function ProjectTaskSection({
  projectId,
  projectTypeId,
}: {
  projectId: string;
  projectTypeId: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const projectTasks = useGetProjectTasks(projectId);

  const renderBody = () => {
    if (projectTasks.isPending)
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              className="px-5 py-10 space-y-2 rounded-lg bg-slate-200 flex justify-between  animate-pulse"
              key={i}
            ></div>
          ))}
        </div>
      );

    if (projectTasks?.isError)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">Somthing went wrong</p>
        </div>
      );

    if (projectTasks?.value?.data?.length === 0)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">
            No task currently on this project
          </p>
        </div>
      );

    return (
      <div className="space-y-3">
        {projectTasks?.value?.data?.map((task) => <TaskCard key={task.id} task={task} />)}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
        <div className="flex justify-end gap-3 items-center">
          <Button size="sm" variant="outline" leftIcon={<Filter />}>
            Filter
          </Button>
          <Button size="sm" leftIcon={<Plus />} onClick={onOpen}>
            Add Task
          </Button>
        </div>
        <div>{renderBody()}</div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <AddProjectTaskModal
            isOpen={isOpen}
            projectTypeId={projectTypeId}
            projectId={projectId}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectTaskSection;
