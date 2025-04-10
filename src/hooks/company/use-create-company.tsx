import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useCreateCompany = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      industry_type: string;
      size: string;
      country: string;
      address: string;
      city: string;
      postal_code: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.CREATE_COMPANY,
  });
};

export default useCreateCompany;
