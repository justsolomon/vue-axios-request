import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  InitialResponseData,
  InitialStateKeys,
  NetworkRequestType,
} from "./types";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const axiosInstance = axios.create({
  cancelToken: source.token,
});

function useNetworkRequest<RequestDataType>(
  this: Record<string, any>,
  url: string,
  initialData: InitialStateKeys,
  config: AxiosRequestConfig,
  errorHandler: (error: AxiosError) => void,
): NetworkRequestType<RequestDataType> {
  let { data } = initialData;
  const { loading, error } = initialData;

  let initialDataValue: null | string = null;

  if (typeof data !== "string") {
    const { key, value } = data as InitialResponseData;

    data = key;
    initialDataValue = value;
  }

  function reset(this: Record<string, any>) {
    this[data as string] = initialDataValue;
    this[loading] = false;

    if (error) this[error] = null;
  }

  const resetData = reset.bind(this);

  function cancelRequest() {
    source.cancel("Request cancelled.");
  }

  function axiosRequest(
    this: Record<string, any>,
    body?: RequestDataType,
    params?: RequestDataType,
  ) {
    this[loading] = true;

    const requestConfig = {
      url,
      ...config,
      data: config
        ? config.data
          ? Object.assign(config.data, body)
          : body
        : body,
      params,
    };

    axiosInstance(requestConfig)
      .then((response: AxiosResponse) => {
        resetData();
        this[data as string] = response.data;
      })
      .catch((axiosError: AxiosError) => {
        resetData();
        if (errorHandler) errorHandler(axiosError);
        else this[error as string] = axiosError;
      });
  }

  const dispatchRequest = axiosRequest.bind(this);

  return { resetData, cancelRequest, dispatchRequest };
}

export default useNetworkRequest;
