<template>
    <div>
      <h2>Reset Password</h2>
      <form @submit.prevent="resetPassword">
        <input type="password" v-model="newPassword" placeholder="New password" required />
        <button type="submit">Reset Password</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axiosInstance from '@/services/axiosConfig';
  
  export default {
    data() {
      return {
        newPassword: '',
        message: ''
      };
    },
    methods: {
    async resetPassword() {
    try {
      // Get the token from route parameters
      const token = this.$route.params.token;

      // Send the new password to the backend
      const response = await axiosInstance.post(`/reset-password/${token}`, {
        newPassword: this.newPassword // Send the new password directly
      });

      // Assuming your backend sends a success message
      this.message = response.data.message;
    } catch (err) {
      console.error('Error:', err); // Log the error for debugging
      this.message = err.response ? err.response.data.message || 'Something went wrong' : 'Something went wrong';
    }
  }
}

  };
  </script>
  