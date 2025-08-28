<template>
  <div id="app">
    <HeaderNav />
    <router-view></router-view>
    <FooterComponent />
    <!-- This will display the routed components -->
    <ShoppingCart
      v-show="isCartVisible"
      :isVisible="isCartVisible"
      @close="closeCart"
    />
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
import FooterComponent from "./components/FooterComponent.vue";
import ShoppingCart from "./components/ShoppingCart.vue";

export default {
  name: "App",
  components: {
    HeaderNav,
    PopupComponent,
    FooterComponent,
    ShoppingCart,
  },
  computed: {
    ...mapState(["isPopupVisible", "isCartVisible"]),
  },
  methods: {
    closePopup() {
      this.$store.dispatch("closePopup");
    },
    closeCart() {
      this.$store.dispatch("closeCart");
    },
  },

  // Load cart from localStorage when the app is mounted
  mounted() {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      this.$store.commit("setCart", savedCart); // Commit the saved cart to Vuex store
      this.$store.commit("cleanExpiredCartItems"); // Remove expired items after loading
    }
    
    // Start periodic cart cleanup
    this.$store.dispatch("startCartExpirationCheck");
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
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Outfit", sans-serif;
}

:root {
  --dark-beige-background: #d5cac0;
  --light-beige-background: #efeae5;
  --white: #fdfdfd;
  --dark: #202020;
}
textarea,
input.text,
input[type="text"],
input[type="file"],
input[type="button"],
input[type="submit"],
input[type="search"],
input[type="number"] input[type="datetime-local"],
select,
.input-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none; /* firefox browser */
  color: black;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  padding: 8px 16px;
}
input[type="file"]::file-selector-button {
  border: 1px solid black;
  border-radius: 0;
  background-color: white;
  transition: 1s;
  color: black;
}

input[type="file"]::file-selector-button:hover {
  background-color: black;
  color: white;
}
body,
html {
  height: 100%;
}

.carousel__pagination-button::after {
  width: 9px !important;
  height: 9px !important;
  border-radius: 6px !important;
  background-color: unset !important;
  border: 1px solid black;
}

.carousel__pagination-button {
  background-color: unset !important;
}

.carousel__pagination-item {
  display: flex !important;
}
.carousel__prev,
.carousel__next,
.carousel__icon {
  width: 75px !important;
  height: 75px !important;
}
.carousel__pagination {
  gap: 6px !important;
}
.carousel__pagination-button--active::after {
  background-color: black !important;
  width: 12px !important;
  height: 12px !important;
  border-radius: 6px;
}

.swal2-title {
  font-family: "Playfair Display", serif;
}

.swal2-styled {
  background-color: white;
  color: #202020;
  width: 200px;
  border: 1px solid #202020;
  border-radius: 0px;
  font-family: "Playfair Display", serif;
}

.swal2-styled:hover {
  background-color: #202020;
  color: white;
}

.swal2-popup {
  box-sizing: border-box;
  border: 1px solid #202020;
  border-radius: 0px;
}

@media (max-width: 768px) {
  textarea,
  input.text,
  input[type="text"],
  input[type="file"],
  input[type="button"],
  input[type="submit"],
  input[type="search"],
  input[type="number"] input[type="datetime-local"],
  select,
  .input-checkbox,
  textarea {
    font-size: 16px;
  }
  .carousel__prev,
  .carousel__next {
    top: unset !important;
    transform: translateY(0%) !important;
    bottom: 0px;
  }
  .carousel__prev {
    left: 20% !important;
  }
  .carousel__next {
    right: 20% !important;
  }
  .carousel__prev,
  .carousel__next,
  .carousel__icon {
    width: 24px !important;
    height: 24px !important;
  }
  .reviews .carousel__prev,
  .reviews .carousel__next {
    top: 50% !important;
    transform: translateY(-50%) !important;
  }
  .reviews .carousel__prev {
    left: 0 !important;
  }
  .reviews .carousel__next {
    right: 0 !important;
  }
  .reviews .carousel__prev,
  .reviews .carousel__next,
  .reviews .carousel__icon {
    width: 40px !important;
    height: 40px !important;
    fill: white !important;
  }
}
</style>
