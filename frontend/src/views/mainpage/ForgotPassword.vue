<template>
  <div v-if="codesent == false">
    <div>
    <h2>Password Reset</h2>
    <h4>We are going to send a code to your email where you have to provide it here to reset your password!</h4>
    <form @submit.prevent="sendCode">
      <label for="email">Email</label>
      <input name="email" v-model="email" type="email" placeholder="Enter your email" required>
      <button type="submit">Send Code</button>
    </form>
  </div>

    <div v-if="codesent">
      <!-- If code is sent, show the other panel to insert the code -->
      <form @submit.prevent="validateCode">
        <label for="code">Code</label>
        <input name="code" v-model="code" placeholder="Enter your code (e.g., AGO15N)" type="text" required>
        <button type="submit">Validate Code</button>
      </form>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/services/axiosConfig';

export default {
  name: 'ResetPassword',
  data() {
    return {
      email: '',
      code: '',
      codesent: false, // Track if the code has been sent
    };
  },
  methods: {
    async sendCode() {
      // Logic to send code to email
      try {
        const response = await axiosInstance.post('/forgot-password', {
          email: this.email
        });

        // Check the response from the server
        if (response.data.success) {
          this.codesent = true; // Code sent successfully
        } else {
          alert(response.data.message || 'Error sending code');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to send code.');
      }
    },

    async validateCode() {
      try {
        const response = await axiosInstance.post("/reset-password-validate", {
          email: this.email,
          code: this.code
        });

        // Check the response from the server
        if (response.data.success) {
          // If validation is successful, redirect to password reset page
          this.$router.push(`/reset-password/${response.data.token}`);
        } else {
          alert(response.data.message || 'Invalid code');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to validate code.');
      }
    }
  }
};
</script>

<style scoped>
/* Basic styles for better layout */
h2, h4 {
  margin: 0 0 1em;
}

form {
  margin: 1em 0;
}

input {
  display: block;
  margin-bottom: 1em;
  padding: 0.5em;
  width: 100%;
  max-width: 300px;
}

button {
  padding: 0.5em 1em;
}
</style>
