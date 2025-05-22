import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { CompanyDetails, Pagination } from "@/types/api.types";

const useGetAllCompanies = (page?: number, pageSize?: number, search?: string) => {
  return useQueryActionHook<{
    success: boolean;
    message: string;
    data: {
      data: CompanyDetails[];
      pagination: Pagination;
    };
  }>({
    method: "get",
    endpoint: `${ENDPOINTS.GET_ALL_COMPANIES}${page ? `?page=${page}` : ""}${pageSize ? `&pageSize=${pageSize}` : ""}${search ? `&search=${search}` : ""}`,
    queryKey: [QUERYKEYS.GET_ALL_COMPANIES, `${page}`, `${pageSize}`, `${search}`],
  });
};

export default useGetAllCompanies;
