import { AxiosError, AxiosRequestConfig } from "axios";
import { InitialStateKeys, NetworkRequestType } from "./types";
declare function useNetworkRequest<RequestDataType>(
  this: Record<string, any>,
  url: string,
  initialData: InitialStateKeys,
  config: AxiosRequestConfig,
  errorHandler: (error: AxiosError) => void,
): NetworkRequestType<RequestDataType>;
export default useNetworkRequest;
