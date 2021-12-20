import {
  InitialStateKeys,
  NetworkRequestOptions,
  NetworkRequestType,
} from "./types";
declare function useNetworkRequest<RequestDataType>(
  this: Record<string, any>,
  url: string,
  initialData: InitialStateKeys,
  options: NetworkRequestOptions,
): NetworkRequestType<RequestDataType>;
export default useNetworkRequest;
