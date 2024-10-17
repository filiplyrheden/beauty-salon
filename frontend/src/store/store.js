import Vuex from "vuex";

export const store = new Vuex.Store({
  state: {
    isLoggedIn: false,
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
  actions: {
    checkAuth({ commit }) {
      const token = localStorage.getItem("token");
      if (token) {
        commit("login");
      }
    },
  },
});
