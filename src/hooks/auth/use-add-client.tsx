import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface AddClientPayload {
  name: string;
  email: string;
  send_notification?: boolean;
}

const useAddClient = () => {
  return useCustomMutation<
    Record<string, string>,
    AddClientPayload
  >({
    method: "post",
    endpoint: ENDPOINTS.ADD_CLIENT,
  });
};

export default useAddClient;
