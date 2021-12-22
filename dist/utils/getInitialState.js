function getInitialState(data, loading, error, isRequest) {
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
