import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useUpdateMilestone = (milestoneId: string) => {
  return useCustomMutation<
    Record<string, string>,
    {
      name?: string;
      duration?: string;
      is_completed?: boolean;
    }
  >({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_MILESTONE_DETAILS(milestoneId),
  });
};

export default useUpdateMilestone;
