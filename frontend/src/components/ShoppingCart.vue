<template>
  <div>
    <h2>Your Cart</h2>
    <div v-if="cartItems.length === 0">
      Inga varor i din korg, Gå och shoppa! <a href="/shop">link</a>
    </div>
    <div v-for="item in cartItems" :key="item.id">
      <p>{{ item.product_name }} - {{ item.price }} (x{{ item.quantity }})</p>
      <!-- Button for removing or decrementing item -->
      <button @click="handleDecrementOrRemove(item.product_id)">
        {{ item.quantity === 1 ? "Ta bort" : "-" }}
      </button>
      <button @click="incrementItemInCart(item.product_id)">+</button>
    </div>
    <h3>Total: {{ totalPrice.toFixed(2) }}</h3>
    <button @click="handleCheckout">Proceed to Checkout</button>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";

export default {
  name: "ShoppingCart",
  computed: {
    cartItems() {
      return this.$store.getters.cartItems;
    },
    totalPrice() {
      return this.$store.getters.cartTotalPrice;
    },
  },
  methods: {
    addItemToCart(product) {
      this.$store.commit("addToCart", product);
    },
    incrementItemInCart(productId) {
      this.$store.commit("incrementItemInCart", productId);
    },
    decrementItem(productId) {
      this.$store.commit("decrementItemInCart", productId); // Commit the Vuex mutation
    },
    removeItem(productId) {
      this.$store.commit("removeFromCart", productId);
    },
    clearCart() {
      this.$store.commit("clearCart");
    },
    // Method to handle both decrement and remove logic
    handleDecrementOrRemove(productId) {
      const item = this.$store.state.cart.find(
        (item) => item.product_id === productId
      );
      if (item.quantity === 1) {
        this.removeItem(productId); // Remove the item if quantity is 1
      } else {
        this.decrementItem(productId); // Otherwise, decrement the quantity
      }
    },
    async handleCheckout() {
      try {
        console.log(this.$store.state.userId);
        const response = await axiosInstance.post("/create-checkout-session", {
          dummyItems: this.$store.state.cart.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
          user_id: this.$store.state.userId
        });

        // Manually handle the redirect from the 303 status
        const { url } = response.data;
        window.location.href = url;
      } catch (error) {
        if (error.response && error.response.status === 303) {
          // If 303, redirect manually to the URL in the response
          const redirectUrl = error.response.data.url;
          window.location.href = redirectUrl;
        } else {
          console.error("Error creating checkout session:", error);
        }
      }
    },
  },
};
</script>
