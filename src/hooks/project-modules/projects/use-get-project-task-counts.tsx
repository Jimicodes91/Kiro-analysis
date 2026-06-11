import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { TaskDetails } from "@/types/api.types";

export interface TaskListResponse {
  success: boolean;
  message: string;
  data: TaskDetails[];
}

export interface ProjectTaskCounts {
  overdue: number;
  pending: number;
}

function calculateTaskCounts(tasks: TaskDetails[]): ProjectTaskCounts {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const overdue = tasks.filter((task) => {
    const endDate = new Date(task.end_date);
    endDate.setHours(0, 0, 0, 0);
    return endDate < now && task.status !== "completed";
  }).length;

  const pending = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  return { overdue, pending };
}

const useGetProjectTaskCounts = (projectId: string) => {
  const query = useQueryActionHook<TaskListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECT_TASKS(projectId),
    queryKey: [QUERYKEYS.GET_ALL_PROJECT_TASKS, projectId, "task-counts"],
    staleTime: 60000,
    enabled: !!projectId,
  });

  const tasks = query.value?.data ?? [];
  const counts = calculateTaskCounts(tasks);

  return {
    ...query,
    data: counts,
    overdue: counts.overdue,
    pending: counts.pending,
  };
};

export default useGetProjectTaskCounts;
