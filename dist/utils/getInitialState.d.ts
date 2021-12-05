import { InitialResponseData, InitialState, InitialStateKeys } from "../types";
declare function getInitialState<ResponseDataType>(
  this: Record<string, any>,
  data: string | InitialResponseData,
  loading: string,
  error: string,
): InitialState<ResponseDataType> | InitialStateKeys;
export default getInitialState;
