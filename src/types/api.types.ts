import { QueryFunction, QueryKey } from "@tanstack/react-query";
import { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, Method } from "axios";

export type CustomMethod = "get" | "put" | "delete" | "post" | "patch";

export interface SecureRequestProps<T = Record<string, unknown>> {
  method?: Method;
  url: string;
  body?: Record<string, unknown>;
  headers?: AxiosRequestHeaders;
  endpoint?: string;
  queryKey?: string | string[] | number[];
  showSuccessToast?: boolean;
  showFailureToast?: boolean;
  message?: string;
  queryFn?: QueryFunction<PylottResponseType<T>, QueryKey>;
  extraConfig?: AxiosRequestConfig<unknown> | undefined;
}

export interface RequestResponse<T = Record<string, unknown>> {
  queryFn?: QueryFunction<PylottResponseType<T>, QueryKey>;
}

export type PylottResponseType<D = Record<string, unknown>> = AxiosResponse<
  CredentialsServerResponseModel<D> & { message: string }
>;

export type CredentialsServerResponseModel<T> = T;

export interface ResponseErrorType {
  message: string;
  name: string;
  errors?: Record<string, unknown>;

  response: {
    data: {
      response_message: string;
      status: number;
      statusCode: number;
      message: string;
      details: string[];
      errors?: Record<string, unknown>;
      source: string;
    };
  };
}
