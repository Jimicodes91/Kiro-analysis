import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useToggleProjectFieldRequirement = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      type: string;
      options: string[];
      is_required: boolean;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.ADD_FORM_FIELDS,
  });
};

export default useToggleProjectFieldRequirement;
