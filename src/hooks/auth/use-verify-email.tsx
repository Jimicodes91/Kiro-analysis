import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useVerifyEmail = (token: string) => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.VERIFY_EMAIL(token),
    queryKey: [QUERYKEYS.VERIFY_EMAIL, token],
  });
};

export default useVerifyEmail;
