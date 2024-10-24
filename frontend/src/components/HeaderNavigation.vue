<template>
  <header class="header-nav">
    <nav>
      <ul>
        <li v-for="(link, index) in navLinks" :key="index">
          <router-link
            :to="link.path"
            exact-active-class="active"
            active-class="active"
          >
            {{ link.name }}
          </router-link>
        </li>
        <li>
          <router-link v-if="!isLoggedIn" to="/register">Register</router-link>
        </li>
        <li>
          <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
          <a v-else @click="handleLogout">Logout</a>
          <router-link v-if="isLoggedIn && !isAdmin" to="/user/profile"
            >Profil</router-link
          >
        </li>
        <li>
          <router-link v-if="isLoggedIn && isAdmin" to="/admin"
            >Admin</router-link
          >
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
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      navLinks: [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: "About", path: "/about-us" },
        { name: "Behandlingar", path: "/behandlingar" },
        { name: "Contact", path: "/contact" },
      ],
    };
  },
  computed: {
    ...mapState(["isLoggedIn", "isAdmin"]),
    cartCount() {
      return this.$store.getters.cartCount; // Correctly using the getter for cart count
    },
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    ...mapMutations(["logout"]), // Map the logout mutation

    handleLogout() {
      // Remove token and call logout mutation

      this.logout();
      this.$router.push("/"); // Redirect to home
    },

    checkAuthentication() {
      this.$store.dispatch("checkAuth");
    },
  },
};
</script>

<style scoped>

.cart-badge{
  position: absolute;
  top: -8px;
  right: -18px;
  background-color: rgb(41, 34, 150);
  color: white;
  border-radius: 50%;
  padding: 2px 7px;
  font-size: 12px;
}

.li-styles{
  position: relative;
}
.header-nav {
  background-color: #333;
  padding: 10px;
}
.menu-icon {
  color: white;
}
ul {
  list-style: none;
  display: flex;
  gap: 20px;
}
li a {
  color: white;
  text-decoration: none;
}
li a:hover {
  text-decoration: underline;
}
.active {
  font-weight: bold; /* or any styling to indicate the active link */
}
</style>
