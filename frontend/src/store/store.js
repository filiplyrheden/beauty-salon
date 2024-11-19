import Vuex from "vuex";
import Swal from "sweetalert2";

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
    isMobileMenuVisible: false,
  },
  mutations: {
    toggleMobileMenuVisibility(state) {
      state.isMobileMenuVisible = !state.isMobileMenuVisible;
    },
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
      state.cart = cartItems;
    },
    addToCart(
      state,
      { product, size_id, quantityFromProductPage, availableStock }
    ) {
      const item = state.cart.find(
        (i) => i.product_id === product.product_id && i.size_id === size_id
      );

      const requestedQuantity = quantityFromProductPage || 1;
      const currentQuantity = item ? item.quantity : 0;
      const newQuantity = currentQuantity + requestedQuantity;
      // Check stock availability
      if (newQuantity > availableStock) {
        Swal.fire(
          "OBS",
          `Förlåt, endast ${availableStock} enheter finns tillgängliga för ${product.product_name} (Storlek: ${size_id}).`
        );
        return; // Exit if requested quantity exceeds stock
      }

      if (item) {
        item.quantity = newQuantity; // Update quantity
        state.lastAddedItem = item;
        state.cartPopupVisible = true;
      } else {
        const newItem = {
          product_id: product.product_id,
          product_name: product.product_name,
          price: product.variants.find((v) => v.size_id === size_id).price,
          size: product.variants.find((v) => v.size_id === size_id).size,
          size_id: size_id,
          quantity: requestedQuantity,
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
      const item = state.cart.find(
        (i) => i.product_id === productId && i.size_id === sizeId
      );
      if (item) {
        item.quantity++;
      }
    },
    decrementItemInCart(state, { productId, sizeId }) {
      const item = state.cart.find(
        (i) => i.product_id === productId && i.size_id === sizeId
      );
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },

    removeFromCart(state, { productId, sizeId }) {
      state.cart = state.cart.filter(
        (item) => !(item.product_id === productId && item.size_id === sizeId)
      );
    },
    clearCart(state) {
      state.cart = [];
      localStorage.removeItem("cart");
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
            commit("showPopup");
            return false;
          }
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
      dispatch("checkTokenExpiration");
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
