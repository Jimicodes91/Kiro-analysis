import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useCreateContact = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      phone: string;
      email: string;
      organization: string;
      active_projects: string;
      total_projects: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.CREATE_CONTACT,
  });
};

export default useCreateContact;
