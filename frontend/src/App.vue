<template>
  <div id="app">
    <HeaderNav />
    <router-view></router-view>
    <!-- This will display the routed components -->
    <PopupComponent
      v-if="isPopupVisible"
      :isVisible="isPopupVisible"
      @close="closePopup"
    />
  </div>
</template>

<script>

import { mapState } from "vuex";
import HeaderNav from "./components/HeaderNavigation.vue";
import PopupComponent from "./components/LogoutPopup.vue";

export default {
  name: "App",
  components: {
    HeaderNav,
    PopupComponent,
  },
  computed: {
    ...mapState(["isPopupVisible"]),
  },
  methods: {
    closePopup() {
      this.$store.dispatch("closePopup");
    },
  },

  // Load cart from localStorage when the app is mounted
  mounted() {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      this.$store.commit("setCart", savedCart); // Commit the saved cart to Vuex store
    }
  },

  // Watch the Vuex cart state and sync with localStorage
  watch: {
    // Watch the cart state in Vuex
    "$store.state.cart": {
      // When the cart changes, this handler will run
      handler(newCart) {
        // Save the new cart to localStorage
        localStorage.setItem("cart", JSON.stringify(newCart));
      },
      deep: true, // Watch for changes in nested properties of the cart (e.g., item quantity)
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Outfit", sans-serif;
}

body,
html {
  height: 100%;
}
</style>
