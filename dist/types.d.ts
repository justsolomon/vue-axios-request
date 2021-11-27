export interface InitialResponseData {
  key: string;
  value: any;
}
export declare type InitialState<ResponseDataType> = Record<
  string,
  InitialResponseData | ResponseDataType | null | boolean
>;
export interface InitialStateKeys {
  data: string | InitialResponseData;
  loading: string;
  error?: string;
}
export interface NetworkRequestType<RequestDataType> {
  resetData: () => void;
  cancelRequest: () => void;
  dispatchRequest: (body?: RequestDataType, params?: RequestDataType) => void;
}
