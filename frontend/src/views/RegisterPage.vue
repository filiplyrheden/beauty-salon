<template>
  <div class="register-container">
    <div class="register-wrapper">
      <h1>REGISTRERA</h1>
      <form @submit.prevent="handleRegister" class="register-form">
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
        <div class="form-group">
          <input
            v-model="firstname"
            name="firstname"
            type="firstname"
            id="firstname"
            required
            class="input-field"
          />
          <label for="firstname" class="label">Förnamn</label>
        </div>
        <div class="form-group">
          <input
            v-model="lastname"
            name="lastname"
            type="lastname"
            id="lastname"
            required
            class="input-field"
          />
          <label for="lastname" class="label">Efternamn</label>
        </div>
        <button type="submit" class="submit-button">REGISTRERA</button>
        <p v-if="message" :class="{ error: isError }">{{ message }}</p>
      </form>
      <div>
        Har du ett konto redan? Logga in
        <router-link to="/login">här</router-link>
      </div>
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
      firstname: "",
      lastname: "",
      message: "",
      isError: false,
    };
  },
  methods: {
    ...mapMutations(["login", "admin", "logout"]), // Map necessary mutations

    async handleRegister() {
      const registerData = {
        email: this.email,
        password: this.password,
        first_name: this.firstname,
        last_name: this.lastname,
      };

      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/register`,
          registerData
        );
        this.message = "Registration successful!";
        this.isError = false;

        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        // Decode token to get user role
        const decodedToken = JSON.parse(
          atob(response.data.token.split(".")[1])
        );

        // Commit the login mutation to Vuex store
        this.login();

        // Get the intended route to redirect after registration (default to home if none)
        const redirectTo = this.$route.query.redirect || "/user/profil";

        // Check if user is admin and commit the corresponding mutation
        if (decodedToken.role === "admin") {
          this.admin(); // Mark the user as admin
          this.$router.push(
            redirectTo === "/user/profil" ? "/admin" : redirectTo
          ); // Redirect to admin panel or intended page
        } else {
          this.$router.push(redirectTo); // Redirect to the intended route or home page
        }
      } catch (error) {
        console.error("Error registering:", error);
        this.message = "Error registering. Please try again.";
        this.isError = true;
      }
    },
  },
  created() {
    // Optional: check if the user is already authenticated when the component is created
    this.$store.dispatch("checkAuth");
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.register-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f9f9f9;
  border: 1px solid black;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.register-form {
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
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: white;
  color: black;
}

.error {
  color: red; /* Style for error messages */
}
h1 {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 32px;
}
</style>
