import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {},
  mutations: {
    addStoreItem: (state, { key, value }) => {
      state[key] = value;
    },
  },
  getters: {
    getStoreItem: (state) => (key) => {
      return state[key];
    },
  },
});
