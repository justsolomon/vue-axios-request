import { InitialResponseData, InitialState, InitialStateKeys } from "./types";

const getInitialState = <ResponseDataType>(
  data: string | InitialResponseData,
  loading: string,
  error: string,
  isRequest: boolean,
): InitialState<ResponseDataType> | InitialStateKeys => {
  let initialState;

  if (!isRequest) {
    initialState = {
      ...(typeof data === "string"
        ? { [data]: null }
        : { [data.key]: data.value }),
      ...(error ? { [error]: null } : {}),
      [loading]: false,
    };
  } else {
    initialState = {
      data,
      loading,
      ...(error ? { error } : {}),
    };
  }

  return initialState;
};

export default getInitialState;
