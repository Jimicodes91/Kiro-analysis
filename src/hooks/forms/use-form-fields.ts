import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateFormField = (templateId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "post",
    endpoint: ENDPOINTS.CREATE_FORM_FIELD(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_TEMPLATE, templateId] });
    },
  });
};

export const useUpdateFormField = (templateId: string, fieldId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_FORM_FIELD(templateId, fieldId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_TEMPLATE, templateId] });
    },
  });
};

export const useDeleteFormField = (templateId: string, fieldId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_FORM_FIELD(templateId, fieldId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_TEMPLATE, templateId] });
    },
  });
};

export const useReorderFormFields = (templateId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "patch",
    endpoint: ENDPOINTS.REORDER_FORM_FIELDS(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_TEMPLATE, templateId] });
    },
  });
};
