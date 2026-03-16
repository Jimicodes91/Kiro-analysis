import { secureRequest } from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch pending invites
export const usePendingInvites = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["pending-invites", page, pageSize],
    queryFn: async () => {
      const response = await secureRequest({
        url: `${API_BASE_URL}/api/v1/contacts/invites/pending`,
        method: "GET",
        body: { page, pageSize },
      });
      return response;
    },
  });
};

// Approve invite
export const useApproveInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      const response = await secureRequest({
        url: `${API_BASE_URL}/api/v1/contacts/invites/${inviteId}/approve`,
        method: "POST",
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch pending invites
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });
    },
  });
};

// Reject invite
export const useRejectInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      const response = await secureRequest({
        url: `${API_BASE_URL}/api/v1/contacts/invites/${inviteId}/reject`,
        method: "POST",
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch pending invites
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });
    },
  });
};
