import Toast from "@/components/Toast";
import { secureRequest } from "@/services/api.service";
import {
  PylottResponseType,
  ResponseErrorType,
  SecureRequestProps,
} from "@/types/api.types";
import { MutationFunction, UseMutationOptions, useMutation } from "@tanstack/react-query";

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

const errorFormatter = (data: {
  message: string;
  data?: {
    errors: string[];
  };
  errors?: Record<string, unknown>;
}) => {
  if (data === null) return "";
  if (Array.isArray(data?.data?.errors)) {
    let message = data?.message;
    data?.data?.errors.forEach((item) => {
      message += `\n\t\n [${item}]`;
    });
    return message;
  }

  if (data.message) return data.message;
  return "Server error";
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
        // console.log(err?.response?.data, "err?.response?.data");
        Toast.error(errorMsg ?? "Server Error");
      }
      mutatationResult.reset();
    },
    onSettled: (
      res: PylottResponseType<P> | undefined,
      err: ResponseErrorType | null
    ) => {
      if (err) mutatationResult.reset();
      if (!err && (showSuccessToast || message)) {
        Toast.success(`${message ?? res?.data?.message}`);
      }
      return;
    },
    retry: false,
    ...others,
  });

  return { ...mutatationResult, value: mutatationResult?.data?.data };
}

export default useCustomMutation;
