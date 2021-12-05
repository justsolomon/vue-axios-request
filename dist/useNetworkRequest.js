import axios from "axios";
import store from "./store";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const axiosInstance = axios.create({
  cancelToken: source.token,
});
function useNetworkRequest(url, storeMutation, config, errorHandler) {
  let initialData = store.getters.getStoreItem(
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
        if (errorHandler) errorHandler(axiosError);
        else this[error] = axiosError;
      });
  }
  const dispatch = axiosRequest.bind(this);
  return { reset, cancel, dispatch };
}
export default useNetworkRequest;
