import Vuex from "vuex";

export const store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    isAdmin: false,
    expirationInterval: null,
    isTokenValid: false,
    LogoutPopup: false,
  },
  mutations: {
    showPopup(state) {
      state.isPopupVisible = true;
    },
    hidePopup(state) {
      state.isPopupVisible = false;
    },
    login(state) {
      state.isLoggedIn = true;
      console.log("Inloggad");
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
    setExpirationInterval(state, intervalId) {
      state.expirationInterval = intervalId;
    },
    clearExpirationInterval(state) {
      if (state.expirationInterval) {
        clearInterval(state.expirationInterval);
        state.expirationInterval = null;
      }
    },
  },
  actions: {
    checkTokenExpiration({ commit }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Math.floor(Date.now() / 1000);

          if (decodedToken.exp && decodedToken.exp < currentTime) {
            commit("logout");
            commit("clearExpirationInterval");
            console.log("Token has expired.");
            commit('showPopup');
            return false;
          }
          console.log("Token is valid");
          return true;
        } catch (error) {
          console.error("Error decoding token:", error);
          commit("logout");
          return false;
        }
      }
      return false;
    },

    closePopup({ commit }) {
      commit('hidePopup');
    },

    startTokenExpirationCheck({ dispatch, commit }) {
      console.log("Starta räkning");
      const intervalId = setInterval(() => {
        dispatch("checkTokenExpiration");
      }, 31 * 60 * 1000); // 31 minutes in milliseconds
    
      commit("setExpirationInterval", intervalId);
    },
    

    stopTokenExpirationCheck({ commit }) {
      commit("clearExpirationInterval");
    },

    checkAuth({ commit, dispatch }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
            if (decodedToken.role === "admin") {
              console.log("Starta räkning");
              commit("admin");
              dispatch("startTokenExpirationCheck");
            } else {
              commit("login");
              console.log("Starta räkning");
              dispatch("startTokenExpirationCheck");
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
