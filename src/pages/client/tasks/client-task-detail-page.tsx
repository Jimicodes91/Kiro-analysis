import useGetTaskDetails from "@/hooks/project-modules/tasks/use-get-task-details";
import { useParams } from "react-router-dom";
import ClientTaskView from "./client-task-view";

const ClientTaskDetailPage = () => {
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();

  const taskQuery = useGetTaskDetails(projectId ?? "", taskId ?? "");

  if (taskQuery.isPending) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded" />
        <div className="h-4 w-96 bg-slate-200 animate-pulse rounded" />
        <div className="space-y-3 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-lg border" />
          ))}
        </div>
      </div>
    );
  }

  if (taskQuery.isError || !taskQuery.value?.data) {
    return (
      <div className="p-6">
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade">Task not found</p>
        </div>
      </div>
    );
  }

  return <ClientTaskView task={taskQuery.value.data} />;
};

export default ClientTaskDetailPage;
