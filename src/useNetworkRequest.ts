import axios, { AxiosError, AxiosResponse } from "axios";
import {
  InitialResponseData,
  InitialStateKeys,
  NetworkRequestOptions,
  NetworkRequestType,
} from "./types";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const axiosInstance = axios.create({
  cancelToken: source.token,
});

/* eslint-disable  @typescript-eslint/no-explicit-any */
function useNetworkRequest<RequestDataType>(
  this: Record<string, any>,
  url: string,
  initialStateKeys: InitialStateKeys,
  options?: NetworkRequestOptions,
): NetworkRequestType<RequestDataType> {
  if (!options) options = {};

  let { data } = initialStateKeys;
  const { loading, error } = initialStateKeys;

  let initialDataValue: null | string = null;

  if (typeof data !== "string") {
    const { key, value } = data as InitialResponseData;

    data = key;
    initialDataValue = value;
  }

  const { storeMutation } = options;
  function resetData(this: Record<string, any>) {
    this[data as string] = initialDataValue;
    if (storeMutation && this.$store) {
      this.$store.commit(storeMutation, initialDataValue);
    }

    this[loading] = false;

    if (error) this[error] = null;
  }

  function cancelRequest(this: Record<string, any>) {
    this[loading] = false;
    source.cancel("Request cancelled.");
  }

  function axiosRequest(
    this: Record<string, any>,
    body?: RequestDataType,
    params?: RequestDataType,
  ) {
    const { config, errorHandler } = options as NetworkRequestOptions;
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

        if (error) this[error as string] = axiosError;
        if (errorHandler) errorHandler(axiosError);
      });
  }

  const reset = resetData.bind(this);
  const cancel = cancelRequest.bind(this);
  const dispatch = axiosRequest.bind(this);

  return { reset, cancel, dispatch };
}

export default useNetworkRequest;
