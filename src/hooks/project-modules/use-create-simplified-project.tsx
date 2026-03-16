import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export interface CreateSimplifiedProjectSchema {
  name: string;
  project_type_id: string;
  start_date: string;
  client_email: string;
  client_phone: string;
  client_name?: string;
  project_value?: number;
  nationality?: string;
  notes?: string;
  send_client_invite?: boolean;
  invite_message?: string;
}

const useCreateSimplifiedProject = () => {
  const queryClient = useQueryClient();

  return useCustomMutation<CreateSimplifiedProjectSchema, any>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_SIMPLIFIED_PROJECT,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_CONTACTS],
      });
    },
  });
};

export default useCreateSimplifiedProject;
