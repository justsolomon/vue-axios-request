import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import store from "./store";
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
  storeMutation?: string,
  config?: AxiosRequestConfig,
  errorHandler?: (error: AxiosError) => void,
): NetworkRequestType<RequestDataType> {
  let initialData: InitialStateKeys = store.getters.getStoreItem(
    this.$options.name || this.$options._componentTag,
  );

  if (!initialData) {
    initialData = {
      data: "data",
      loading: "loading",
      error: "error",
    };
  }

  let { data } = initialData;
  const { loading, error } = initialData;

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
        reset();

        this[data as string] = response.data;
        if (storeMutation && this.$store) {
          this.$store.commit(storeMutation, response.data);
        }
      })
      .catch((axiosError: AxiosError) => {
        reset();

        if (errorHandler) errorHandler(axiosError);
        else this[error as string] = axiosError;
      });
  }

  const dispatch = axiosRequest.bind(this);

  return { reset, cancel, dispatch };
}

export default useNetworkRequest;
