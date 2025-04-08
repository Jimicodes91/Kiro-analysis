import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useAddClient = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      email: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.ADD_CLIENT,
  });
};

export default useAddClient;
