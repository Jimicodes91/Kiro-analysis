import { Button } from "@/components/ui/button";
import useGetProjectTasks from "@/hooks/project-modules/tasks/use-get-project-tasks";
import { getIsClient, getUserSession } from "@/services/api.service";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/cards/task-card";

function ProjectTaskSection({
  projectId,
  projectTypeId,
  mode = "edit",
}: {
  projectId: string;
  projectTypeId: string;
  mode?: "readonly" | "edit";
}) {
  const navigate = useNavigate();
  const user = getUserSession();

  const isClient = getIsClient();
  const projectTasks = useGetProjectTasks(projectId, isClient ? user?.id : undefined);

  const handleAddTask = () => {
    navigate(`/task/new?projectId=${projectId}&from=project:${projectId}`);
  };

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
    <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
      {mode === "edit" && (
        <div className="flex justify-end gap-3 items-center">
          <Button size="sm" leftIcon={<Plus />} onClick={handleAddTask}>
            Add Task
          </Button>
        </div>
      )}
      <div>{renderBody()}</div>
    </div>
  );
}

export default ProjectTaskSection;
