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
          <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
          <a v-else @click="logout">Logout</a>
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
      navLinks: [
        { name: "Home", path: "/" },
        { name: "Om mig", path: "/about" },
        { name: "Behandlingar", path: "/services" },
        { name: "Kontakt", path: "/contact" },
      ],
    };
  },
  computed: {
    ...mapState(["isLoggedIn"]),
  },
  created() {
    this.$store.dispatch("checkAuth"); // Check auth status when component is created
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$store.commit("logout"); // Commit logout mutation
      this.$router.push("/"); // Redirect to home
    },
  },
};
</script>

<style scoped>
.header-nav {
  background-color: #333;
  padding: 10px;
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
