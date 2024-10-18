<template>
  <div class="login-container">
    <div class="login-wrapper">
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <input
            v-model="email"
            name="mail"
            type="text"
            id="mail"
            required
            class="input-field"
          />
          <label for="mail" class="label">Email</label>
        </div>
        <div class="form-group">
          <input
            v-model="password"
            name="password"
            type="password"
            id="password"
            required
            class="input-field"
          />
          <label for="password" class="label">Password</label>
        </div>
        <button type="submit" class="submit-button">Login</button>
        <p v-if="message" :class="{ error: isError }">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      message: "",
      isError: false,
    };
  },
  methods: {
    ...mapMutations(["login", "admin", "logout"]), // Map necessary mutations

    async handleLogin() {
      const loginData = {
        email: this.email,
        password: this.password,
      };

      try {
        const response = await axios.post(
          "http://localhost:3000/login",
          loginData
        );
        this.message = "Login successful!";
        this.isError = false;

        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        // Decode token to get user role
        const decodedToken = JSON.parse(
          atob(response.data.token.split(".")[1])
        );

        // Commit the login mutation to Vuex store
        this.login();

        // Check if user is admin and commit the corresponding mutation
        if (decodedToken.role === "admin") {
          this.admin(); // Mark the user as admin
          this.$router.push("/admin"); // Redirect to admin panel
        } else {
          this.$router.push("/"); // Redirect to home page
        }
      } catch (error) {
        console.error("Error logging in:", error);
        this.message = "Error logging in. Please try again.";
        this.isError = true;
      }
    },
  },
  created() {
    // Check authentication status on component creation
    this.$store.dispatch("checkAuth");
    console.log("checkauth");
  },
};
</script>
