import { InitialResponseData, InitialState, InitialStateKeys } from "../types";
import store from "@/store";

function getInitialState<ResponseDataType>(
  this: Record<string, any>,
  data: string | InitialResponseData,
  loading: string,
  error: string,
): InitialState<ResponseDataType> | InitialStateKeys {
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
