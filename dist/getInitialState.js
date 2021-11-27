const getInitialState = (data, loading, error, isRequest) => {
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
//# sourceMappingURL=getInitialState.js.map
