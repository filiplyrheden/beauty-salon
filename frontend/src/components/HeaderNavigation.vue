<template>
  <header :class="['header-nav', 'sticky', { hidden: isTopBarHidden }]">
    <div :class="['top-bar']">
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
            <a
              href="https://www.google.com/maps/place/Vasaplatsen+7B,+411+26+G%C3%B6teborg/@57.6993155,11.9686789,17z/data=!4m6!3m5!1s0x464ff36e4641dd05:0x616043b9427a534e!8m2!3d57.6993155!4d11.9686789!16s%2Fg%2F11csfkmj2n?entry=ttu&g_ep=EgoyMDI0MTEwNS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              >Vasaplatsen - Göteborg</a
            >
          </li>
          <li class="mobile-top-bar">
            <a
              v-if="isCurrentLinkExternal"
              :href="currentTopBarLink.path"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ currentTopBarLink.name }}
            </a>
            <router-link v-else :to="currentTopBarLink.path">
              {{ currentTopBarLink.name }}
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <nav class="main-nav">
      <div
        class="burger-menu"
        @click="toggleMobileMenu"
        :class="{ open: isMobileMenuVisible }"
      >
        <span class="burger-line top"></span>
        <span class="burger-line middle"></span>
        <span class="burger-line bottom"></span>
      </div>

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
      <router-link to="/" class="logo">
        <img src="@/assets/snbeautylogo.svg" alt="SN Beauty Logo" />
      </router-link>

      <ul class="right-links">
        <li>
          <router-link v-if="!isLoggedIn" to="/login"
            ><img src="../assets/User.svg" alt="" />
          </router-link>
          <router-link v-if="isLoggedIn && !isAdmin" to="/user/profil"
            ><img src="../assets/User.svg" alt=""
          /></router-link>
          <router-link v-if="isLoggedIn && isAdmin" to="/admin"
            ><img src="../assets/admin.svg" alt="" />
          </router-link>
        </li>

        <li class="li-styles">
          <button class="noBorder" @click="openCart">
            <img src="../assets/Shopping_Bag.svg" alt="" />
          </button>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </li>
      </ul>

      <div v-if="isCartPopupVisible" class="cartPopupWrapper">
        <div class="popupHeader">
          <button class="cartExitButton" @click="hideCartPopup()">
            <img src="../assets/exit.svg" alt="" />
          </button>
        </div>
        <div class="item-content">
          <div class="title">Tillagd i varukorgen!</div>
          <div v-if="lastAddedItem" class="cart-item">
            <img
              class="cart-image"
              :src="getImageUrl(lastAddedItem.image_url)"
              :alt="lastAddedItem.name"
            />
            <div class="cartNameandPrice">
              <p>{{ lastAddedItem.product_name }}</p>
              <p>{{ lastAddedItem.size }}</p>
              <p>{{ lastAddedItem.price }} kr</p>
            </div>
          </div>
          <p class="totalCart">
            Totala belopp: {{ cartTotalPrice.toFixed(2) }} kr
          </p>
        </div>
      </div>
    </nav>
    <transition name="slide">
      <div v-if="isMobileMenuVisible" class="mobile-menu">
        <ul class="mobile-links">
          <li v-for="(link, index) in navLinksLeft" :key="index">
            <router-link
              :to="link.path"
              @click="toggleMobileMenu"
              exact-active-class="active"
              active-class="active"
            >
              {{ link.name }}
            </router-link>
          </li>
        </ul>
        <a href="https://www.bokadirekt.se/places/sn-beauty-56396">
          <button class="bokadirekt">BOKADIREKT</button>
        </a>
      </div>
    </transition>
  </header>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import throttle from "lodash-es/throttle";

export default {
  data() {
    return {
      navLinksLeft: [
        { name: "Behandlingar", path: "/behandlingar" },
        { name: "Produkter", path: "/shop" },
        { name: "Event", path: "/events" },
        { name: "Kurser", path: "/kurser" },
        { name: "Salongen", path: "/om-mig" },
      ],
      topBarLinks: [
        { name: "Boka behandling och Kurs", path: "/behandlingar" },
        { name: "Köp hudvård online", path: "/shop" },
        {
          name: "Vasaplatsen - Göteborg",
          path: "https://www.google.com/maps/place/Vasaplatsen+7B,+411+26+G%C3%B6teborg/@57.6993155,11.9686789,17z/data=!4m6!3m5!1s0x464ff36e4641dd05:0x616043b9427a534e!8m2!3d57.6993155!4d11.9686789!16s%2Fg%2F11csfkmj2n?entry=ttu&g_ep=EgoyMDI0MTEwNS4wIKXMDSoASAFQAw%3D%3D",
        },
      ],
      currentTopBarLinkIndex: 0,
      lastScrollPosition: 0,
      isTopBarHidden: false,
      throttledScrollHandler: null,
    };
  },
  watch: {
    isMobileMenuVisible(value) {
      document.body.style.overflow = value ? "hidden" : "";
    },
  },
  computed: {
    ...mapState([
      "isLoggedIn",
      "isAdmin",
      "isCartVisible",
      "isMobileMenuVisible",
    ]),

    lastAddedItem() {
      return this.$store.getters.lastAddedItem;
    },
    cartCount() {
      return this.$store.getters.cartCount;
    },
    isCartPopupVisible() {
      return this.$store.getters.cartPopup;
    },
    isCurrentLinkExternal() {
      return this.currentTopBarLink.path.startsWith("http");
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
    this.throttledScrollHandler = throttle(this.handleScroll, 200);
    window.addEventListener("scroll", this.throttledScrollHandler);
  },
  beforeUnmount() {
    clearInterval(this.linkRotationInterval);
    window.removeEventListener("scroll", this.throttledScrollHandler);
  },
  methods: {
    ...mapMutations({
      incrementItemInCart: "incrementItemInCart",
      decrementItemInCart: "decrementItemInCart",
      removeFromCart: "removeFromCart",
      hideCartPopup: "hideCartPopup",
      showCartPopup: "showCartPopup",
      showCart: "showCart",
      toggleMobileMenuVisibility: "toggleMobileMenuVisibility",
    }),
    handleScroll() {
      this.isTopBarHidden = window.scrollY > 50;
    },
    openCart() {
      this.showCart();
    },
    toggleMobileMenu() {
      this.toggleMobileMenuVisibility();
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
      }, 3000);
    },
  },
};
</script>

<style scoped>
.top-bar {
  background-color: #000;
  color: #fff;
  padding: 8px 72px;
  height: 100%;
  transition: all 0.3s ease-in-out;
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
.main-nav {
  max-width: 1280px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 72px;
  margin: 0 auto;
  position: relative;
}

.left-links,
.right-links {
  display: flex;
  gap: 20px;
  list-style: none;
}
.left-links {
  position: absolute;
  left: 72px;
  display: flex;
  gap: 20px;
}
.right-links {
  position: absolute;
  right: 72px;
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
  height: 44px;
}

.cart-badge {
  display: flex;
  height: 19px;
  width: 19px;
  position: absolute;
  top: -8px;
  right: -18px;
  background-color: black;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  justify-content: center;
  align-items: center;
}

.menu-icon {
  color: black;
}

.active {
  font-weight: bold;
}

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

.cartPopupWrapper {
  z-index: 99;
  padding: 10px;
  background-color: white;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  width: 363px;
  position: absolute;
  top: 90%;
  right: 67px;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.item-content .title {
  text-align: center;
  font-weight: 600;
  font-size: 18px;
}
.cart-item {
  display: flex;
  width: 100%;
  height: 48px;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.checkoutButton {
  font-family: "Playfair Display", serif;
  background-color: #202020;
  color: white;
  height: 47px;
}

.cartAddRemoveQuantity {
  align-self: flex-end;
  display: flex;
  margin-left: auto;
  height: 28px;
  width: 72px;
  align-items: center;
  border: 2px solid black;
}

.cartAddRemoveQuantity button {
  cursor: pointer;
}
.noLinkStyles {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.incrementDecrementText {
  width: 24px;
  text-align: center;
  font-size: 18px;
}
.cart-image {
  height: 48px;
  width: 48px;
  object-fit: contain;
}
.totalCart {
  display: flex;
  justify-content: end;
  font-size: 16px;
}
.trashIcon {
  height: 24px;
  width: 24px;
}
.cartExitButton {
  all: unset;
  border: none;
  cursor: pointer;
}
.noBorder {
  all: unset;
  cursor: pointer;
  border: none;
}
.cartExitButton:hover {
  cursor: pointer;
}
.popupHeader {
  display: flex;
  justify-content: end;
}
.incrementDecrement {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 20px;
  object-fit: cover;
  align-content: center;
  border: none;
}
.sticky {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
}
.hidden {
  transform: translate(0px, -37px);
}
.header-nav {
  background-color: white;
  transition: all 0.3s ease-in-out;
}
.burger-menu {
  display: none;
  left: 72px;
  width: 30px;
  height: 30px;
  flex-direction: column;
  justify-content: space-around;
  cursor: pointer;
}

.burger-line {
  width: 100%;
  border-radius: 2px;
  height: 2px;
  background-color: black;
  transition: all 0.3s ease;
  position: relative;
}

.burger-line.middle {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.burger-menu.open .top {
  transform: rotate(45deg);
  position: absolute;
  top: 12px;
}

.burger-menu.open .middle {
  opacity: 0;
}

.burger-menu.open .bottom {
  transform: rotate(-45deg);
  position: absolute;
  top: 12px;
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 1000;
  overflow: hidden;
  height: calc(100vh - 133px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 64px;
}
.mobile-links {
  list-style-type: none;
  display: flex;
  gap: 16px;
  flex-direction: column;
}
.bokadirekt {
  width: 100%;
  background-color: black;
  border: 1px solid black;
  color: white;
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  padding: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}
.bokadirekt:hover {
  background-color: white;
  color: black;
}
.mobile-links a {
  text-decoration: none;
  color: black;
  font-family: "Playfair Display", serif !important;
  font-size: 2em;
}

.slide-enter-active,
.slide-leave-active {
  transition: height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  height: 0;
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  height: calc(100vh - 112px);
  opacity: 1;
}
@media (min-width: 992px) and (max-width: 1200px) {
  .right-links {
    right: 32px;
  }
  .left-links {
    left: 32px;
  }
}
@media (max-width: 992px) {
  .logo img {
    height: 40px;
  }
  .burger-menu {
    display: flex;
    position: absolute;
    left: 32px;
    width: 24px;
    height: 24px;
  }
  .top-bar {
    padding: 8px 32px;
  }
  .right-links {
    right: 32px;
    gap: 8px;
  }
  .main-nav {
    padding: 16px 32px;
  }

  .left-links {
    display: none;
  }

  .mobile-top-bar {
    display: block;
    width: 100%;
    text-align: center;
  }
  .desktop-top-bar {
    display: none;
  }
}
@media (max-width: 450px) {
  .cartPopupWrapper {
    right: 50%;
    transform: translate(50%, 0);
    width: 90%;
  }
}
</style>
