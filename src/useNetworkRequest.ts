import axios, { AxiosError, AxiosResponse, Method } from "axios";
import {
  InitialResponseData,
  InitialStateKeys,
  NetworkRequestOptions,
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
): NetworkRequestWrapper<RequestDataType> {
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

  function axiosRequestHandler(method: Method) {
    return function axiosRequest(
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
    };
  }

  const defaultReturn = { reset, cancel };
  return {
    get() {
      return { ...defaultReturn, dispatch: axiosRequestHandler("GET") };
    },
    post() {
      return { ...defaultReturn, dispatch: axiosRequestHandler("POST") };
    },
    patch() {
      return { ...defaultReturn, dispatch: axiosRequestHandler("PATCH") };
    },
    put() {
      return { ...defaultReturn, dispatch: axiosRequestHandler("PUT") };
    },
    delete() {
      return { ...defaultReturn, dispatch: axiosRequestHandler("DELETE") };
    },
  };
}

export default useNetworkRequest;
