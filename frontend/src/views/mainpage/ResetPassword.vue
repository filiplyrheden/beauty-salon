<template>
  <div class="pageWrapper">
    <div class="resetPasswordWrapper">
      <h2>Välj Nytt Lösenord</h2>
      <form class="formWrapper" @submit.prevent="resetPassword">
        <input class="passwordInput" type="password" v-model="newPassword" placeholder="New password" required />
        <button type="submit">Reset Password</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
  <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    
  </template>
  
  <script>
  import axiosInstance from '@/services/axiosConfig';
  
  export default {
    data() {
      return {
        newPassword: '',
        message: '',
        isLoading: false,
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
  <style scoped>
  .pageWrapper{
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
  h2{
    font-family:"Playfair Display", serif;
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
  