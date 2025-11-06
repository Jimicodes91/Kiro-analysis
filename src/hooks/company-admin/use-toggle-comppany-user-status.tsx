import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useToggleCompanyUserStatus = (companyId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>>({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_COMPANY_USER_STATUS(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_COMPANY_USERS],
      });
    },
  });
};

export default useToggleCompanyUserStatus;
