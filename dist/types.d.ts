export interface InitialResponseData {
  /** Key of the request data */
  key: string;
  /** Default value of the request data */
  value: any;
}
export interface StoreMutationPayload {
  key: string;
  value: any;
}
export declare type RootState = Record<string, any>;
export declare type InitialState<ResponseDataType> = Record<
  string,
  InitialResponseData | ResponseDataType | null | boolean
>;
export interface InitialStateKeys {
  /** Key used to represent the request data */
  data: string | InitialResponseData;
  /** Key used to represent the loading status of the network request */
  loading: string;
  /** Key used to represent the request error */
  error?: string;
}
export interface NetworkRequestType<RequestDataType> {
  /** Resets the initial network state's values to the default values */
  reset: () => void;
  /** Cancels the ongoing network request */
  cancel: () => void;
  /** Dispatches the network request using Axios
   *
   * @param body the request's body
   * @param params the request's query params
   * @example
   * ```js
   * //An example GET request
   * dispatch({}, { page: 1 })
   *
   * //An example POST request
   * dispatch({
   *    firstName: "John",
   *    lastName: "Doe"
   * })
   * ```
   */
  dispatch: (body?: RequestDataType, params?: RequestDataType) => void;
}
