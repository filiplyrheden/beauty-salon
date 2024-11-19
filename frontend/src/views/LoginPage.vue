<template>
  <div class="login-container">
    <div class="login-wrapper">
      <h1>LOGGA IN</h1>
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
          <label for="password" class="label">Lösenord</label>
        </div>
        <button type="submit" class="submit-button">LOGGA IN</button>
        <p v-if="message" :class="{ error: isError }">{{ message }}</p>
      </form>
      <div class="no-account">
        Har du inte ett konto ännu? Registrera dig
        <router-link to="/register">här</router-link>
      </div>
      <div class="forgotPassword">
        Har du glömt ditt lösenord..?
        <router-link to="/forgot-password">Klicka här</router-link>
      </div>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      message: "",
      isError: false,
      isLoading: false,
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
        this.isLoading = true;
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/login`,
          loginData
        );

        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        // Decode token to get user role
        const decodedToken = JSON.parse(
          atob(response.data.token.split(".")[1])
        );

        // Commit the login mutation to Vuex store
        this.login();

        // Get the intended route to redirect after login (default to home if none)
        const redirectTo = this.$route.query.redirect || "/";

        // Check if user is admin and commit the corresponding mutation
        if (decodedToken.role === "admin") {
          this.admin(); // Mark the user as admin
          this.$router.push(redirectTo === "/" ? "/admin" : redirectTo); // Redirect to admin panel or intended page
        } else {
          this.$router.push(redirectTo); // Redirect to the intended route or home page
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Swal.fire(
          "Error",
          `Du kunde inte loggas in, snälla kolla dina uppgifter och försök igen senare eller kontakta oss.`,
          "error"
        );
        this.isLoading = false;
      }
    },
  },
  created() {
    // Check authentication status on component creation
    this.$store.dispatch("checkAuth");
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 112px);
  background-color: #f0f0f0;
  padding: 20px; /* Added padding to avoid content touching edges */
}

.login-wrapper {
  max-width: 600px;
  width: 100%; /* Make the wrapper take full width on smaller screens */
  margin: 0 auto;
  padding: 40px;
  background-color: #f9f9f9;
  border: 1px solid black;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; /* Ensures padding doesn't exceed the width */
}

h1 {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 32px;
  text-align: center; /* Center align for mobile */
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  background: #fff;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: black;
}

.label {
  position: absolute;
  top: -20px;
  left: 0;
  font-size: 14px;
  color: #555;
  transition: all 0.3s ease;
}

.submit-button {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-weight: 600;
  background-color: black;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border: 1px solid black;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: white;
  color: black;
}

.no-account,
.forgotPassword {
  margin-top: 16px;
  text-align: center;
  font-size: 14px; /* Smaller font for mobile */
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #007bff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  color: red; /* Style for error messages */
  text-align: center;
}

@media (max-width: 767px) {
  .login-wrapper {
    padding: 20px; /* Reduce padding on smaller screens */
    box-shadow: none; /* Remove shadow for a cleaner look on mobile */
  }

  h1 {
    font-size: 20px; /* Reduce title font size */
    margin-bottom: 24px;
  }

  .input-field {
    padding: 10px; /* Reduce padding for input fields on smaller screens */
    font-size: 16px; /* Smaller font for input fields */
  }

  .submit-button {
    font-size: 14px; /* Smaller font for button */
    padding: 10px; /* Smaller padding for button */
  }
}
</style>
