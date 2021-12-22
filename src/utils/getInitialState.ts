import { InitialResponseData, InitialState, InitialStateKeys } from "../types";

function getInitialState<ResponseDataType = null>(
  data?: string | InitialResponseData,
  loading?: string,
  error?: string,
  isRequest?: boolean,
): InitialState<ResponseDataType> | InitialStateKeys {
  if (!data) data = "data";
  if (!loading) loading = "loading";
  if (!error) error = "error";

  let initialState;

  if (!isRequest) {
    initialState = {
      ...(typeof data === "string"
        ? { [data]: null }
        : { [data.key]: data.value }),
      [error]: null,
      [loading]: false,
    };
  } else {
    initialState = {
      data,
      loading,
      error,
    };
  }

  return initialState;
}

export default getInitialState;
