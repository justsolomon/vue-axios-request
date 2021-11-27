import axios from "axios";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const axiosInstance = axios.create({
  cancelToken: source.token,
});
function useNetworkRequest(url, initialData, config, errorHandler) {
  let { data } = initialData;
  const { loading, error } = initialData;
  let initialDataValue = null;
  if (typeof data !== "string") {
    const { key, value } = data;
    data = key;
    initialDataValue = value;
  }
  function reset() {
    this[data] = initialDataValue;
    this[loading] = false;
    if (error) this[error] = null;
  }
  const resetData = reset.bind(this);
  function cancelRequest() {
    source.cancel("Request cancelled.");
  }
  function axiosRequest(body, params) {
    this[loading] = true;
    const requestConfig = {
      url,
      ...config,
      data: config?.data ? Object.assign(config?.data, body) : body,
      params,
    };
    axiosInstance(requestConfig)
      .then((response) => {
        resetData();
        this[data] = response.data;
      })
      .catch((axiosError) => {
        resetData();
        if (errorHandler) errorHandler(axiosError);
        else this[error] = axiosError;
      });
  }
  const dispatchRequest = axiosRequest.bind(this);
  return { resetData, cancelRequest, dispatchRequest };
}
export default useNetworkRequest;
