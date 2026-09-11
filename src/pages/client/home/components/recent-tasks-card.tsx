import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetProjectTasks from "@/hooks/project-modules/tasks/use-get-project-tasks";
import { safeFormatDate } from "@/lib/utils";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { getUserSession } from "@/services/api.service";
import { CircleCheckBig } from "lucide-react";
import TaskItem from "./task-item";

function RecentTaskCard() {
  const { activeProject } = useClientProjectContext();
  const user = getUserSession();

  const projectTasks = useGetProjectTasks(activeProject?.id ?? "", user?.id);

  const renderBody = () => {
    if (projectTasks.isPending)
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              className="flex items-center flex-wrap gap-2 justify-between rounded-lg border p-3 bg-slate-100 border-[#0000001A] h-[70px]"
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
        {projectTasks?.value?.data?.map(
          (task, index) =>
            index <= 3 && (
              <TaskItem
                key={task.id}
                title={task.name}
                status={task.status}
                due={safeFormatDate(task?.end_date, "MMM d, yyyy", "No due date")}
              />
            )
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="-space-y-0">
        <CardTitle className="text-lg flex gap-2 items-center">
          <CircleCheckBig className="h-5 w-5 text-black" />
          Recent Task
        </CardTitle>
        <p className="text-sm text-muted-foreground">Your current and upcoming task</p>
      </CardHeader>
      <CardContent className="space-y-3">{renderBody()}</CardContent>
    </Card>
  );
}

export default RecentTaskCard;
