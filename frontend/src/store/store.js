import Vuex from "vuex";

export const store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    isAdmin: false,
    expirationInterval: null,
    isTokenValid: false,
    LogoutPopup: false,
    userId: null,
    cart: JSON.parse(localStorage.getItem("cart")) || [], // Load cart from localStorage or start with an empty array
  },
  mutations: {
    // Other mutations...

    setCart(state, cartItems) {
      state.cart = cartItems;
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Save to localStorage
    },
    addToCart(state, product) {
      const item = state.cart.find((i) => i.product_id === product.product_id);
      if (item) {
        item.quantity++;
      } else {
        state.cart.push({
          product_id: product.product_id,
          product_name: product.product_name,
          price: product.price,
          quantity: 1,
          image_url: product.images[0]?.image_url, // Assuming the first image is primary
        });
      }
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Save updated cart to localStorage
    },
    incrementItemInCart(state, productId) {
      const item = state.cart.find((i) => i.product_id === productId);
      if (item) {
        item.quantity++;
        localStorage.setItem("cart", JSON.stringify(state.cart)); // Update localStorage
      }
    },
    decrementItemInCart(state, productId) {
      const item = state.cart.find((i) => i.product_id === productId);
      if (item) {
        item.quantity--;
        if (item.quantity === 0) {
          state.cart = state.cart.filter((i) => i.product_id !== productId); // Remove item if quantity is 0
        }
        localStorage.setItem("cart", JSON.stringify(state.cart)); // Update localStorage
      }
    },
    removeFromCart(state, productId) {
      state.cart = state.cart.filter((item) => item.product_id !== productId);
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Save updated cart to localStorage
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
      return state.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
});
