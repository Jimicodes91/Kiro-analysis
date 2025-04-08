import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useCreateMilestone = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      start_date: string;
      end_date: string;
      project_type_id: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.CREATE_MILESTONE,
  });
};

export default useCreateMilestone;
