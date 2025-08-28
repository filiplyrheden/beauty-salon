<template>
  <div class="pageWrapper">
    <div class="resetPasswordWrapper">
      <h2>Återställ Lösenord</h2>
      <p>Vi kommer att skicka en länk till din e-post där du kan återställa ditt lösenord!</p>
      <form class="formWrapper" @submit.prevent="sendCode">
        <label for="email">Email</label>
        <input class="passwordInput" name="email" v-model="email" type="email" placeholder="Enter your email" required>
        <button type="submit" :disabled="isLoading">Skicka Kod</button>
      </form>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/services/axiosConfig';
import Swal from 'sweetalert2';

export default {
  name: 'ResetPassword',
  data() {
    return {
      email: '',
      isLoading: false,
    };
  },
  methods: {
    async sendCode() {
      this.isLoading = true;
      try {
        await axiosInstance.post('/forgot-password', {
          email: this.email
        });
          Swal.fire(
            "Success",
            "Du kommer nu få ett email med en länk där du kan byta lösenord!",
            "success"
          );
      } catch (error) {
        const errorMessages =
          error.response?.data?.errors?.map((e) => e.msg).join("<br>") ||
          "Okänt fel uppstod. Försök igen senare.";
        
        Swal.fire(
          "Error",
          `Email kunde inte skickas, försök igen senare eller kontakta oss. <br> ${errorMessages}`,
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.pageWrapper {
  display: flex;
  width: 100%;
  height: 80vh;
  padding: 50px;
}

.resetPasswordWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 40px;
  max-width: 400px;
  margin: auto;
  text-align: center;
  background-color: #f9f9f9;
  border: 1px solid #000000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-family: "Playfair Display", serif;
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

.formWrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.passwordInput {
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.passwordInput:focus {
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.2);
}

button {
  width: 100%;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: black;
  color: white;
  font-size: 18px;
  border: solid 1px black;
  font-family: "Playfair Display", serif;
}

button:hover {
  background-color: #ffffff;
  color: black;
}

label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}
</style>
