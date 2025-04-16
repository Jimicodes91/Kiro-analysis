import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useToggleProjectFieldRequirement = (fieldId: string) => {
  return useCustomMutation<
    Record<string, string>,
    {
      is_required: boolean;
    }
  >({
    method: "patch",
    endpoint: ENDPOINTS.TOGGLE_PROJECT_FIELD_REQUIREMENT(fieldId),
  });
};

export default useToggleProjectFieldRequirement;
