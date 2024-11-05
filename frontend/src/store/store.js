import Vuex from "vuex";

export const store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    isAdmin: false,
    expirationInterval: null,
    isTokenValid: false,
    LogoutPopup: false,
    userId: null,
    cart: [],
    cartPopupVisible: false,
    isCartVisible: false,
    lastAddedItem: null,
  },
  mutations: {
    clearLastAddedItem(state) {
      state.lastAddedItem = null;
    },
    showCartPopup(state) {
      state.cartPopupVisible = true;
    },
    hideCartPopup(state) {
      state.cartPopupVisible = false;
    },
    showPopup(state) {
      state.isPopupVisible = true;
    },
    hidePopup(state) {
      state.isPopupVisible = false;
    },
    showCart(state) {
      state.isCartVisible = true;
    },
    hideCart(state) {
      state.isCartVisible = false;
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
      state.userId = null;
    },
    admin(state) {
      state.isLoggedIn = true;
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
    setUserId(state, userId) {
      state.userId = userId;
    },
    setCart(state, cartItems) {
      state.cart = cartItems; // Assume the cart is already in simplified form
    },
    addToCart(state, { product, size_id, quantityFromProductPage }) {
      const item = state.cart.find(
        (i) => i.product_id === product.product_id && i.size_id === size_id
      );

      if (item) {
        if (quantityFromProductPage) {
          item.quantity += quantityFromProductPage;
        } else {
          item.quantity++;
        }
        state.lastAddedItem = item;
        state.cartPopupVisible = true;
      } else {
        console.log("sizeId in store: " + size_id); // For debugging
        const newItem = {
          product_id: product.product_id,
          product_name: product.product_name,
          price: product.variants.find((v) => v.size_id === size_id).price,
          size: product.variants.find((v) => v.size_id === size_id).size,
          size_id: size_id,
          quantity: quantityFromProductPage || 1,
          image_url: product.image_url_primary,
        };

        state.cart.push(newItem);
        state.lastAddedItem = newItem;
        state.cartPopupVisible = true;
      }

      // Start a 5-second timer to close the popup
      setTimeout(() => {
        state.cartPopupVisible = false;
      }, 5000);
    },

    incrementItemInCart(state, { productId, sizeId }) {
      console.log("incrementItemInCart" + productId + sizeId);
      const item = state.cart.find(
        (i) => i.product_id === productId && i.size_id === sizeId
      );
      if (item) {
        item.quantity++;
      }
    },
    decrementItemInCart(state, { productId, sizeId }) {
      console.log("decrement" + productId);
      const item = state.cart.find(
        (i) => i.product_id === productId && i.size_id === sizeId
      );
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },

    removeFromCart(state, { productId, sizeId }) {
      console.log("removeFromCart" + productId + sizeId);
      state.cart = state.cart.filter(
        (item) => !(item.product_id === productId && item.size_id === sizeId)
      );
    },
    clearCart(state) {
      state.cart = [];
      localStorage.removeItem("cart"); // Remove cart from localStorage
    },
  },
  getters: {
    cartItems: (state) => state.cart,
    cartCount: (state) => {
      return state.cart.reduce((total, item) => total + item.quantity, 0);
    },
    cartTotalPrice: (state) => {
      return state.cart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },
    cartPopup: (state) => state.cartPopupVisible,
    lastAddedItem: (state) => state.lastAddedItem,
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
            commit("showPopup");
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
      commit("hidePopup");
    },

    startTokenExpirationCheck({ dispatch, commit }) {
      console.log("Starta räkning");
      const intervalId = setInterval(() => {
        dispatch("checkTokenExpiration");
      }, 1 * 60 * 1000); // 1 minute

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
          commit("setUserId", decodedToken.userid);

          if (decodedToken.role === "admin") {
            commit("admin");
            dispatch("startTokenExpirationCheck");
          } else {
            commit("login");
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
