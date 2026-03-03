import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useSwitchOrg = () => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>, { companyId: string }>({
    method: "post",
    endpoint: ENDPOINTS.SWITCH_ORG,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_USER],
      });
    },
  });
};

export default useSwitchOrg;
