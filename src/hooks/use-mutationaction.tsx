import { secureRequest } from "@/services/api.service";
import {
  PylottResponseType,
  ResponseErrorType,
  SecureRequestProps,
} from "@/types/api.types";
import { MutationFunction, UseMutationOptions, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

type MutatationParam = Partial<UseMutationOptions> &
  Partial<SecureRequestProps> & { endpoint: string };

function getMutationAction<P, T>(mutationData: Partial<SecureRequestProps>) {
  const { endpoint, method, headers, extraConfig = {} } = mutationData;

  const url = (import.meta.env.VITE_API_BASE_URL as string) + endpoint;

  return {
    mutationFn: (body: Record<string, unknown>) =>
      secureRequest({
        url,
        method,
        body,
        headers,
        extraConfig,
      }) as never as MutationFunction<PylottResponseType<P>, T>,
    ...mutationData,
  };
}

const errorFormatter = (data: unknown) => {
  if (data === null) return "";
  if (Array.isArray(data)) {
    return "Array Error";
  }
  if (typeof data === "object") {
    const castedData = data as Record<string, unknown>;
    const keys = Object.keys(data);
    let message = "";
    keys.forEach((item) => {
      message += `\n ${castedData[item]}`;
    });
    return message;
  }
  return "Another erorr";
};

function useCustomMutation<P = Record<string, unknown>, T = Record<string, unknown>>(
  mutationData: MutatationParam
) {
  const {
    mutationFn,
    endpoint,
    showSuccessToast = true,
    showFailureToast = true,
    message,
    ...others
  } = getMutationAction<P, T>({
    ...mutationData,
  });

  const mutatationResult = useMutation<PylottResponseType<P>, ResponseErrorType, T>({
    // @ts-expect-error unsolved issue
    mutationFn,
    mutationKey: [endpoint],

    onError: (err: ResponseErrorType) => {
      if (showFailureToast) {
        const errorMsg = errorFormatter(err?.response?.data);

        toast.error(errorMsg);
      }
      mutatationResult.reset();
    },
    onSettled: (
      res: PylottResponseType<P> | undefined,
      err: ResponseErrorType | null
    ) => {
      if (err) mutatationResult.reset();
      if (!err && (showSuccessToast || message)) {
        toast.success(`${message ?? res?.data?.message}`);
      }
      return;
    },
    retry: false,
    ...others,
  });

  return { ...mutatationResult, value: mutatationResult?.data?.data };
}

export default useCustomMutation;
