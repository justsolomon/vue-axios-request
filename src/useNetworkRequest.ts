import axios, { AxiosError, AxiosResponse, Method } from "axios";
import {
  InitialResponseData,
  InitialStateKeys,
  NetworkRequestOptions,
  NetworkRequestType,
  NetworkRequestWrapper,
} from "./types";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const axiosInstance = axios.create({
  cancelToken: source.token,
});

function useNetworkRequest<RequestDataType>(
  this: Record<string, any>,
  url: string,
  initialStateKeys: InitialStateKeys,
  options: NetworkRequestOptions,
  method: Method,
): NetworkRequestType<RequestDataType> {
  let { data } = initialStateKeys;
  const { loading, error } = initialStateKeys;

  let initialDataValue: null | string = null;

  if (typeof data !== "string") {
    const { key, value } = data as InitialResponseData;

    data = key;
    initialDataValue = value;
  }

  function resetData(this: Record<string, any>) {
    this[data as string] = initialDataValue;
    this[loading] = false;

    if (error) this[error] = null;
  }

  const reset = resetData.bind(this);

  function cancel() {
    source.cancel("Request cancelled.");
  }

  function axiosRequest(
    this: Record<string, any>,
    body?: RequestDataType,
    params?: RequestDataType,
  ) {
    const { storeMutation, config, errorHandler } = options;
    this[loading] = true;

    const requestConfig = {
      url,
      ...config,
      method,
      data: config
        ? config.data
          ? Object.assign(config.data, body)
          : body
        : body,
      params,
    };

    axiosInstance(requestConfig)
      .then((response: AxiosResponse) => {
        reset();

        this[data as string] = response.data;
        if (storeMutation && this.$store) {
          this.$store.commit(storeMutation, response.data);
        }
      })
      .catch((axiosError: AxiosError) => {
        reset();

        if (error) this[error as string] = axiosError;
        if (errorHandler) errorHandler(axiosError);
      });
  }

  const dispatch = axiosRequest.bind(this);

  return { reset, cancel, dispatch };
}

function useNetworkRequestWrapper<RequestDataType>(
  this: Record<string, any>,
): NetworkRequestWrapper<RequestDataType> {
  const networkRequest = useNetworkRequest.bind(this);

  return {
    get<RequestDataType>(
      url: string,
      initialStateKeys: InitialStateKeys,
      options: NetworkRequestOptions,
    ): NetworkRequestType<RequestDataType> {
      return networkRequest(url, initialStateKeys, options, "GET");
    },
    post<RequestDataType>(
      url: string,
      initialStateKeys: InitialStateKeys,
      options: NetworkRequestOptions,
    ): NetworkRequestType<RequestDataType> {
      return networkRequest(url, initialStateKeys, options, "POST");
    },
    patch<RequestDataType>(
      url: string,
      initialStateKeys: InitialStateKeys,
      options: NetworkRequestOptions,
    ): NetworkRequestType<RequestDataType> {
      return networkRequest(url, initialStateKeys, options, "PATCH");
    },
    put<RequestDataType>(
      url: string,
      initialStateKeys: InitialStateKeys,
      options: NetworkRequestOptions,
    ): NetworkRequestType<RequestDataType> {
      return networkRequest(url, initialStateKeys, options, "PUT");
    },
    delete<RequestDataType>(
      url: string,
      initialStateKeys: InitialStateKeys,
      options: NetworkRequestOptions,
    ): NetworkRequestType<RequestDataType> {
      return networkRequest(url, initialStateKeys, options, "DELETE");
    },
  };
}

export default useNetworkRequestWrapper;
