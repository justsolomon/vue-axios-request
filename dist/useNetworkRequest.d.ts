import {
  InitialStateKeys,
  NetworkRequestOptions,
  NetworkRequestWrapper,
} from "./types";
declare function useNetworkRequest<RequestDataType>(
  this: Record<string, any>,
  url: string,
  initialStateKeys: InitialStateKeys,
  options: NetworkRequestOptions,
): NetworkRequestWrapper<RequestDataType>;
export default useNetworkRequest;
