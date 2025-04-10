import { secureRequest } from "@/services/api.service";
import {
  PylottResponseType,
  ResponseErrorType,
  SecureRequestProps,
} from "@/types/api.types";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

type ActionParams<T> = Partial<SecureRequestProps> &
  Partial<UseQueryOptions<PylottResponseType<T>, ResponseErrorType>> & {
    endpoint: string;
  };

export function getQueryAction<T>(payload: ActionParams<T>) {
  const { endpoint, method, body, headers } = payload;

  const url = (import.meta.env.VITE_API_BASE_URL_TWO as string) + endpoint;

  return {
    queryFn: () => {
      return secureRequest({
        url,
        method,
        body,
        headers,
      });
    },
    ...payload,
  };
}

function useQueryActionHook<T>(data: ActionParams<T>) {
  const { queryFn, queryKey, endpoint, ...others } = getQueryAction({
    ...data,
  });

  // Ensure queryKey is an array
  const finalQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey || endpoint];

  const queryResult = useQuery<PylottResponseType<T>, ResponseErrorType>({
    queryFn,
    queryKey: finalQueryKey,
    retry: false,
    refetchOnWindowFocus: false,
    ...others,
  });

  return {
    ...queryResult,
    value: queryResult.data?.data,
  };
}

export default useQueryActionHook;
