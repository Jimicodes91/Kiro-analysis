import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

interface UseUpdateProjectOptions {
  onStatusCompleted?: () => void;
}

const useUpdateProject = (
  projectId: string,
  options?: UseUpdateProjectOptions
) => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>>({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_PROJECT_DETAILS(projectId),
    onSuccess: (_data: unknown, variables: unknown) => {
      const vars = variables as Record<string, string> | undefined;
      if (vars?.status === "completed" && options?.onStatusCompleted) {
        options.onStatusCompleted();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_PROJECT_DETAILS, projectId],
      });
    },
  });
};

export default useUpdateProject;
