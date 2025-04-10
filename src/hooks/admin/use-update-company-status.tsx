import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

interface UpdateCompanyStatusRequest {
  description?: string;
  file_name?: string;
  document_type_id?: string;
}

const useUpdateCompanyStatus = (companyId: string) => {
  return useCustomMutation<Record<string, string>, UpdateCompanyStatusRequest>({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_COMPANY_STATUS(companyId),
  });
};

export default useUpdateCompanyStatus;
