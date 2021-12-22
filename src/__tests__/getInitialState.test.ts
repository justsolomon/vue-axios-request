import { InitialState } from "../types";
import getInitialState from "../utils/getInitialState";

describe("getInitialState", () => {
  it("should return correct initial state", () => {
    const initialState = getInitialState(
      "testData",
      "testLoading",
      "testError",
    ) as InitialState<null>;

    expect(initialState.testData).toBe(null);
    expect(initialState.testError).toBe(null);
    expect(initialState.testLoading).toBe(false);
  });
  it("should return initial state with custom data value", () => {
    const initialState = getInitialState(
      { key: "data", value: [] },
      "loading",
      "error",
    );

    expect(initialState.data).toStrictEqual([]);
    expect(initialState.error).toBe(null);
    expect(initialState.loading).toBe(false);
  });
  it("should return default initial state when no params are passed", () => {
    const initialState = getInitialState();

    expect(initialState.data).toBe(null);
    expect(initialState.error).toBe(null);
    expect(initialState.loading).toBe(false);
  });
  it("should return initial state with default keys for missing params", () => {
    const initialState = getInitialState(
      "testData",
      "testLoading",
    ) as InitialState<null>;

    expect(initialState.testData).toBe(null);
    expect(initialState.error).toBe(null);
    expect(initialState.testLoading).toBe(false);
  });
  it("should return initial state keys when isRequest is true", () => {
    const initialState = getInitialState("data", "loading", "error", true);

    expect(initialState.data).toBe("data");
    expect(initialState.error).toBe("error");
    expect(initialState.loading).toBe("loading");
  });
});
