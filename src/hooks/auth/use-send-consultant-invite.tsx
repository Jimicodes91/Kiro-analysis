import Toast from "@/components/Toast";
import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";
import { ResponseErrorType } from "@/types/api.types";
import axiosInstance from "@/utils/Https";
import { useMutation } from "@tanstack/react-query";

type PostResponse = { success: boolean; message: string };

interface ISendInvite {
  role: string;
  email: string;
}

const useSendConsultantInvite = () => {
  return useCustomMutation<Record<string, string>, ISendInvite>({
    method: "post",
    endpoint: ENDPOINTS.SEND_CONSULTANT_INVITE,
  });
};

const postData = async (data: ISendInvite): Promise<PostResponse> => {
  const response = await axiosInstance.post(`${ENDPOINTS.SEND_CONSULTANT_INVITE}`, data);
  return response.data;
};

export function useMultiSendInvite() {
  return useMutation({
    mutationFn: async (payloads: ISendInvite[]) => {
      const results = await Promise.all(payloads.map((payload) => postData(payload)));
      return results;
    },
    onSettled: (res) => {
      if (res) {
        console.log(res, "res");
        // Toast.success(`${message ?? res?.data?.message}`);
      }
      return;
    },
    onError: (err: ResponseErrorType) => {
      // @ts-expect-error Something d
      const errorMsg = err?.response?.data?.data;

      Toast.error(errorMsg);
    },
  });
}

export default useSendConsultantInvite;
