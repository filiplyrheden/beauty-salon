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
          <router-link to="/checkout"
            ><font-awesome-icon icon="shopping-bag" class="menu-icon"
          /></router-link>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      navLinksLeft: [
        { name: "Boka", path: "/behandlingar" },
        { name: "Produkter", path: "/shop" },
        { name: "Event & Kurser", path: "/event-och-kurser" },
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
    checkAuthentication() {
      this.$store.dispatch("checkAuth");
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
