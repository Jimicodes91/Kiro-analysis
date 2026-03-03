import { Card, CardContent } from "@/components/ui/card";
import useGetProjectTasks from "@/hooks/project-modules/tasks/use-get-project-tasks";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { getUserSession } from "@/services/api.service";
import { CircleCheckBig } from "lucide-react";

function TaskMetricCard() {
  const { activeProject } = useClientProjectContext();
  const user = getUserSession();

  const projectTasks = useGetProjectTasks(activeProject?.id ?? "", user?.id);

  const completedTasks = projectTasks?.value?.data?.filter(
    (task) => task.status === "completed"
  )?.length;
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <CircleCheckBig className="size-9 text-black" />
        <div className="space-y-1">
          <p className="text-[#191819]">Tasks</p>
          <p className="text-2xl font-bold">
            {projectTasks?.isPending ? (
              <div className="h-8 w-[80px] bg-slate-300 animate-pulse"></div>
            ) : (
              <span className="fade-in">
                {completedTasks}/{projectTasks?.value?.data?.length}
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskMetricCard;
