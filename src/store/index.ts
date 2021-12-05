import Vue from "vue";
import Vuex from "vuex";
import { RootState, StoreMutationPayload } from "@/types";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  state: {},
  mutations: {
    addStoreItem: (state, { key, value }: StoreMutationPayload): void => {
      state[key] = value;
    },
  },
  getters: {
    getStoreItem:
      <DataType>(state: RootState) =>
      (key: string): DataType => {
        return state[key];
      },
  },
});
