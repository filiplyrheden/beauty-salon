import Vuex from "vuex";

export const store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    isAdmin: false,
    isTokenValid: false,
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.isTokenValid = false;
      localStorage.removeItem("token");
    },
    admin(state) {
      state.isAdmin = true;
      state.isTokenValid = true;
    },
    setTokenValidity(state, isValid) {
      state.isTokenValid = isValid;
    },
  },
  actions: {
    checkAuth({ commit }) {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          commit("setTokenValidity", true);
          if (decodedToken.role === "admin") {
            commit("admin");
          } else {
            commit("login");
          }
        } catch (error) {
          console.error("Invalid token:", error);
          commit("logout");
        }
      } else {
        commit("logout");
      }
    },
  },
});
