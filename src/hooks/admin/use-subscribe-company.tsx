import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

interface SubscribeCompanyRequest {
  expiryDate: string;
}

const useSubscribeCompany = (companyId: string) => {
  return useCustomMutation<Record<string, string>, SubscribeCompanyRequest>({
    method: "post",
    endpoint: ENDPOINTS.SUBSCRIBE_COMPANY(companyId),
  });
};

export default useSubscribeCompany;
