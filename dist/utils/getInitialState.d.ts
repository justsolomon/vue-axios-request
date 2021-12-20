import { InitialResponseData, InitialState, InitialStateKeys } from "../types";
declare function getInitialState<ResponseDataType>(
  data: string | InitialResponseData,
  loading: string,
  error: string,
  isRequest: boolean,
): InitialState<ResponseDataType> | InitialStateKeys;
export default getInitialState;
