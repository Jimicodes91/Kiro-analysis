import Heading from "@/components/ui/heading";
import useGetProjectTasks from "@/hooks/project-modules/tasks/use-get-project-tasks";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { getUserSession } from "@/services/api.service";
import ClientTaskBoard from "./components/client-task-board";

export default function ClientTaskManagement() {
  const { activeProject } = useClientProjectContext();
  const user = getUserSession();

  const projectTasks = useGetProjectTasks(activeProject?.id ?? "", user?.id);

  const renderBody = () => {
    if (projectTasks.isPending)
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {[1, 2, 3].map((col) => (
            <div
              key={col}
              className="rounded-xl border border-brand-border bg-[#F8F8F8] p-3 space-y-3"
            >
              <div className="h-5 w-28 rounded bg-slate-200 animate-pulse" />
              <div className="h-[110px] rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-[110px] rounded-lg bg-slate-200 animate-pulse" />
            </div>
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

    const sortedTasks = [...(projectTasks?.value?.data ?? [])].sort(
      (a, b) =>
        new Date(b?.created_at ?? 0).getTime() -
        new Date(a?.created_at ?? 0).getTime()
    );

    return (
      <ClientTaskBoard
        tasks={sortedTasks}
        projectId={activeProject?.id as string}
      />
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 bg-gray-50 page-fade-in">
      <div className="space-y-1 mb-10">
        <Heading size="h3" className="flex items-center gap-2">
          Task Management
          {projectTasks?.isPending ? (
            <div className="h-6 w-[40px] bg-slate-300 animate-pulse"></div>
          ) : (
            <span className="text-lg font-medium">
              ({projectTasks?.value?.data?.length})
            </span>
          )}
        </Heading>
        <p className="text-[#19181980] text-sm">
          Grouped by status so you can see what needs action first.
        </p>
      </div>

      {renderBody()}
    </div>
  );
}
