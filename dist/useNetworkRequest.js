import axios from "axios";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const axiosInstance = axios.create({
  cancelToken: source.token,
});
function useNetworkRequest(url, initialStateKeys, options) {
  let { data } = initialStateKeys;
  const { loading, error } = initialStateKeys;
  let initialDataValue = null;
  if (typeof data !== "string") {
    const { key, value } = data;
    data = key;
    initialDataValue = value;
  }
  function resetData() {
    this[data] = initialDataValue;
    this[loading] = false;
    if (error) this[error] = null;
  }
  const reset = resetData.bind(this);
  function cancel() {
    source.cancel("Request cancelled.");
  }
  function axiosRequest(body, params) {
    const { storeMutation, config, errorHandler } = options;
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
      .then((response) => {
        reset();
        this[data] = response.data;
        if (storeMutation && this.$store) {
          this.$store.commit(storeMutation, response.data);
        }
      })
      .catch((axiosError) => {
        reset();
        if (error) this[error] = axiosError;
        if (errorHandler) errorHandler(axiosError);
      });
  }
  const dispatch = axiosRequest.bind(this);
  return { reset, cancel, dispatch };
}
export default useNetworkRequest;
