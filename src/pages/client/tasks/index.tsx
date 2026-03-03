import useGetProjectTasks from "@/hooks/project-modules/tasks/use-get-project-tasks";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { getUserSession } from "@/services/api.service";
import ClientTaskCard from "./components/client-test-card";

export default function ClientTaskManagement() {
  const { activeProject } = useClientProjectContext();
  const user = getUserSession();

  const projectTasks = useGetProjectTasks(activeProject?.id ?? "", user?.id);

  const renderBody = () => {
    if (projectTasks.isPending)
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              className="px-5 py-10 space-y-2 h-[150px] border rounded-lg bg-slate-200 flex justify-between  animate-pulse"
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
        {projectTasks?.value?.data?.map((task) => (
          <ClientTaskCard
            key={task.id}
            task={task}
            projectId={activeProject?.id as string}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-4 bg-gray-50 page-fade-in">
      <div className="space-y-1 mb-10">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          Task Management
          {projectTasks?.isPending ? (
            <div className="h-6 w-[40px] bg-slate-300 animate-pulse"></div>
          ) : (
            <span className="text-lg font-medium">
              ({projectTasks?.value?.data?.length})
            </span>
          )}
        </h1>
        <p className="text-[#19181980] text-sm">
          Manage your assigned tasks and track progress
        </p>
      </div>

      {/* Review project requirements document */}
      <div className="bg-white space-y-7 p-4 rounded-xl">
        <div>{renderBody()}</div>
      </div>
    </div>
  );
}
