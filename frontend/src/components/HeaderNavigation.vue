<template>
  <header class="header-nav">
    <!-- Top bar section -->
    <div class="top-bar">
      <nav>
        <ul>
          <li class="desktop-top-bar">
            <router-link to="/behandlingar"
              >Boka behandling och Kurs</router-link
            >
          </li>
          <li class="desktop-top-bar">
            <router-link to="/shop">Köp hudvård online</router-link>
          </li>
          <li class="desktop-top-bar">
            <router-link to="/om-mig">Vasaplatsen - Göteborg</router-link>
          </li>
          <li class="mobile-top-bar">
            <router-link :to="currentTopBarLink.path">
              {{ currentTopBarLink.name }}
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Main navigation with logo centered -->
    <nav class="main-nav">
      <ul class="left-links">
        <li v-for="(link, index) in navLinksLeft" :key="index">
          <router-link
            :to="link.path"
            exact-active-class="active"
            active-class="active"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>

      <!-- Centered Logo -->
      <router-link to="/" class="logo">
        <img src="@/assets/snbeauty.png" alt="SN Beauty Logo" />
      </router-link>

      <ul class="right-links">
        <li><font-awesome-icon icon="magnifying-glass" /></li>
        <li>
          <router-link v-if="!isLoggedIn" to="/login"
            ><font-awesome-icon icon="user"
          /></router-link>
          <router-link v-if="isLoggedIn && !isAdmin" to="/user/profil"
            ><font-awesome-icon icon="user"
          /></router-link>
          <router-link v-if="isLoggedIn && isAdmin" to="/admin"
            ><font-awesome-icon icon="lock"
          /></router-link>
        </li>

        <li class="li-styles">
          <button class="noBorder" @click="toggleCartPopup()"> <!-- if cart is already showing if you click it again it disappears -->
            <font-awesome-icon icon="shopping-bag" class="menu-icon"></font-awesome-icon>
          </button>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </li>
      </ul>

      <div v-if="isCartPopupVisible" class="cartPopupWrapper">
        <div class="popupHeader">
          <button class="cartExitButton" @click="hideCartPopup()"><img src="../assets/exit.svg" alt=""></button> <!-- Close button -->
        </div>
        <div class="item-content">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <button @click="removeFromCart(item.product_id)" class="cartExitButton" >
              <img class="trashIcon" src="../assets/trashcan.svg" alt="">
            </button>
            <img class="cart-image" :src="getImageUrl(item.image_url)" :alt="item.name" />
            <div class="cartNameandPrice">
              <p>{{ item.product_name }}</p>
              <p>{{ item.price }} kr</p>
            </div>
            <div class="cartAddRemoveQuantity">
              <button class="incrementDecrement" @click="decrementItemInCart(item.product_id)"><img src="../assets/minus.svg" alt=""></button> <!-- Trashcan button -->
              <p class="incrementDecrementText">{{ item.quantity }}</p>
              <button class="incrementDecrement" @click="incrementItemInCart(item.product_id)"><img src="../assets/plus.svg" alt=""></button>
            </div>
          </div>
          <p class="totalCart">Totala belopp: {{ cartTotalPrice }} kr</p>
          <button class="checkoutButton">
            <a class="noLinkStyles" href="/checkout">CHECKOUT</a>
          </button>
        </div>
      </div>

    </nav>
  </header>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      navLinksLeft: [
        { name: "Boka", path: "/behandlingar" },
        { name: "Produkter", path: "/shop" },
        { name: "Event", path: "/events" },
        { name: "Kurser", path: "/kurser" },
        { name: "Om mig", path: "/om-mig" },
      ],
      topBarLinks: [
        { name: "Boka behandling och Kurs", path: "/behandlingar" },
        { name: "Köp hudvård online", path: "/shop" },
        { name: "Vasaplatsen - Göteborg", path: "/om-mig" },
      ],
      currentTopBarLinkIndex: 0, // For cycling top bar links on mobile
    };
  },
  computed: {
    ...mapState(["isLoggedIn", "isAdmin"]),
    cartCount() {
      return this.$store.getters.cartCount;
    },
    cartItems() {
      return this.$store.getters.cartItems;
    },
    isCartPopupVisible() {
      return this.$store.getters.cartPopup;
    },
    cartTotalPrice() {
      return this.$store.getters.cartTotalPrice;
    },
    currentTopBarLink() {
      return this.topBarLinks[this.currentTopBarLinkIndex];
    },
  },
  created() {
    this.checkAuthentication();
  },
  mounted() {
    this.startLinkRotation();
  },
  beforeUnmount() {
    clearInterval(this.linkRotationInterval);
  },
  methods: {
    ...mapMutations({
      incrementItemInCart: 'incrementItemInCart',
      decrementItemInCart: 'decrementItemInCart',
      removeFromCart: 'removeFromCart',
      hideCartPopup: 'hideCartPopup',
      showCartPopup: 'showCartPopup',
    }),
    toggleCartPopup() {
    if (this.isCartPopupVisible) {
      this.hideCartPopup();
    } else {
      this.showCartPopup();
    }
  },
    checkAuthentication() {
      this.$store.dispatch("checkAuth");
    },
    getImageUrl(imageName) {
      return `${imageName}`;
    },
    startLinkRotation() {
      this.linkRotationInterval = setInterval(() => {
        this.currentTopBarLinkIndex =
          (this.currentTopBarLinkIndex + 1) % this.topBarLinks.length;
      }, 3000); // Adjust time (in ms) as desired for rotation speed
    },
  },
};
</script>

<style scoped>
/* Top bar styling */
.top-bar {
  background-color: #000;
  color: #fff;
  padding: 8px 72px;
}
.top-bar nav {
  max-width: 1280px;
  margin: 0 auto;

}
.top-bar ul {
  list-style: none;
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  max-width: 1280px;
}

.top-bar li a {
  color: #fff;
  text-decoration: none;
  font-family: "Playfair Display", serif !important;
}

.top-bar li a:hover {
  text-decoration: underline;
}

/* Main navigation styling */
.main-nav {
  max-width: 1280px;
  background-color: #fff;
  display: flex;
  justify-content: center; /* Center all content */
  align-items: center;
  padding: 10px 72px;
  border-bottom: 1px solid #eaeaea;
  margin: 0 auto;
  position: relative; /* Allow absolute positioning of left and right sections */
}

.left-links,
.right-links {
  display: flex;
  gap: 20px;
  list-style: none;
}
.left-links {
  position: absolute;
  left: 72px; /* Align with the padding */
  display: flex;
  gap: 20px;
}
.right-links {
  position: absolute;
  right: 72px; /* Align with the padding */
  display: flex;
  gap: 20px;
}

.left-links li,
.right-links li {
  position: relative;
}

.left-links li a,
.right-links li a {
  color: #000;
  text-decoration: none;
  font-family: "Playfair Display", serif !important;
}

.logo img {
  height: 50px; /* Adjust as necessary */
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -18px;
  background-color: rgb(41, 34, 150);
  color: white;
  border-radius: 50%;
  padding: 2px 7px;
  font-size: 12px;
}

.menu-icon {
  color: black;
}

.active {
  font-weight: bold;
}
/* Responsive styling for top-bar */
/* Desktop styling (all links visible) */
.top-bar ul {
  display: flex;
  justify-content: space-between;
}
.desktop-top-bar {
  display: block;
}
.mobile-top-bar {
  display: none;
}

.cartPopupWrapper{
  z-index: 99;
  padding: 10px;
  background-color: white;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  width: 363px;
  position: absolute;
  top: 90%;
  right: 67px; /* ändra sen? */
}

.item-content{
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item{
  display: flex;
  width: 100%;
  height: 48px;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.checkoutButton{
  font-family: 'Playfair Display', serif;
  background-color: #202020;
  color: white;
  height: 47px;
}

.cartAddRemoveQuantity{
  align-self: flex-end;
  display: flex;
  margin-left: auto;
  height: 28px;
  width: 72px;
  align-items: center;
  border: 2px solid black;
}

.cartAddRemoveQuantity button{
  cursor: pointer;
}
.noLinkStyles{
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.incrementDecrementText{
  width: 24px;
  text-align: center;
  font-size: 18px;
}
.cart-image{
  height: 48px;
  width: 48px;
  object-fit:contain;
}
.totalCart{
  display: flex;
  justify-content: end;
  font-size: 20px;
}
.trashIcon{
  height: 24px;
  width: 24px;
}
.cartExitButton{
  border: none;
}
.noBorder{
  cursor: pointer;
  border: none;
}
.cartExitButton:hover{
  cursor: pointer;
}
.popupHeader{
  display: flex;
  justify-content: end;
}
.incrementDecrement{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 20px;
  object-fit: cover;
  align-content: center;
  border:none;
}
/* Mobile styling (only one link visible at a time) */
@media (max-width: 768px) {
  .mobile-top-bar {
    display: block;
    width: 100%;
    text-align: center;
  }
  .desktop-top-bar {
    display: none;
  }
}
</style>
