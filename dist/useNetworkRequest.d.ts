import { AxiosError, AxiosRequestConfig } from "axios";
import { NetworkRequestType } from "./types";
declare function useNetworkRequest<RequestDataType>(
  this: Record<string, any>,
  url: string,
  storeMutation?: string,
  config?: AxiosRequestConfig,
  errorHandler?: (error: AxiosError) => void,
): NetworkRequestType<RequestDataType>;
export default useNetworkRequest;
