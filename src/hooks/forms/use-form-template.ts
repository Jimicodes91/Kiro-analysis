import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateFormTemplate = () => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "post",
    endpoint: ENDPOINTS.CREATE_FORM_TEMPLATE,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_TEMPLATES] });
    },
  });
};

export const useUpdateFormTemplate = (templateId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_FORM_TEMPLATE(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_TEMPLATES] });
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_TEMPLATE, templateId] });
    },
  });
};

export const useDeleteFormTemplate = (templateId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_FORM_TEMPLATE(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_TEMPLATES] });
    },
  });
};

export const useCloneFormTemplate = (templateId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "post",
    endpoint: ENDPOINTS.CLONE_FORM_TEMPLATE(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_TEMPLATES] });
    },
  });
};

export const usePublishFormTemplate = (templateId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "post",
    endpoint: ENDPOINTS.PUBLISH_FORM_TEMPLATE(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_TEMPLATES] });
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_TEMPLATE, templateId] });
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_VERSIONS, templateId] });
    },
  });
};
