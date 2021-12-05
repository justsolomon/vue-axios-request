import store from "@/store";
function getInitialState(data, loading, error) {
  const initialState = {
    ...(typeof data === "string"
      ? { [data]: null }
      : { [data.key]: data.value }),
    ...(error ? { [error]: null } : {}),
    [loading]: false,
  };
  store.commit("addStoreItem", {
    [this.$options.name || this.$options._componentTag]: {
      data,
      loading,
      ...(error ? { error } : {}),
    },
  });
  return initialState;
}
export default getInitialState;
