import { InitialResponseData, InitialState, InitialStateKeys } from "./types";
declare const getInitialState: <ResponseDataType>(
  data: string | InitialResponseData,
  loading: string,
  error: string,
  isRequest: boolean,
) =>
  | InitialStateKeys
  | Record<string, boolean | InitialResponseData | ResponseDataType | null>;
export default getInitialState;
