import { InitialState, InitialStateKeys } from "../types";
import useNetworkRequest from "../useNetworkRequest";
import getInitialState from "../utils/getInitialState";

jest.setTimeout(30000);
describe("useNetworkRequest", () => {
  it("should function correctly", async function (this: Record<string, any>) {
    const stateKeys = ["data", "loading", "error"];
    const initialState = getInitialState(...stateKeys) as InitialState<null>;

    //set initial state in this
    for (const key in initialState) {
      this[key] = initialState[key];
    }

    const networkRequest = useNetworkRequest.bind(this);

    const { dispatch, cancel, reset } = networkRequest(
      "https://jsonplaceholder.typicode.com/users",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      getInitialState(...stateKeys, true) as InitialStateKeys,
    );

    dispatch();
    expect(this.loading).toBe(true);

    //set 10s delay to allow axios complete request
    await new Promise((r) => setTimeout(r, 10000));

    expect(this.loading).toBe(false);
    expect(Array.isArray(this.data)).toBe(true);
    expect(this.data).toHaveLength(10);

    reset();
    expect(this.loading).toBe(false);
    expect(this.data).toBe(null);
    expect(this.error).toBe(null);

    dispatch();
    expect(this.loading).toBe(true);

    cancel();
    expect(this.loading).toBe(false);
  });
});
