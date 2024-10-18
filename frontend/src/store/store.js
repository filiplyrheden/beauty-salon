import Vuex from "vuex";

export const store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    isAdmin: false,
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
    admin(state) {
      state.isAdmin = true;
    },
    adminLogout(state) {
      state.isAdmin = false;
    },
  },
  actions: {
    checkAuth({ commit }) {
      const token = localStorage.getItem("token");
      if (token) {
        commit("login");
      }
    },
    checkAdmin({ commit }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          if (decodedToken.role === "admin") {
            commit("admin");
          } else {
            commit("adminLogout"); // Ensure admin is set to false if role is not admin
          }
        } catch (error) {
          console.error("Invalid token:", error);
          commit("adminLogout"); // Handle any token errors gracefully
        }
      } else {
        commit("adminLogout"); // Ensure admin is logged out if no token is found
      }
    },
  },
});
