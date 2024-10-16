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
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        message: '',
        isError: false,
      };
    },
    methods: {
      async handleLogin() {
        const loginData = {
          email: this.email,
          password: this.password,
        };
  
        try {
          const response = await axios.post("http://localhost:3000/login", loginData);
          this.message = "Login successful: " + response.data;
          this.isError = false;
          // Store token (consider using Vuex or another state management)
          localStorage.setItem('token', response.data.token);
          this.message = 'Login successful.';
          // Redirect to protected route
        } catch (error) {
            console.error("Error logging in:", error);
            this.message = "Error logging in. Please try again.";
            this.isError = true;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center; 
    height: 100vh; 
    background-color: #f0f0f0;
  }
  
  .login-wrapper {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
    border-color: #007bff;
  }
  
  .label {
    position: absolute;
    top: -20px;
    left: 12px;
    font-size: 14px;
    color: #555;
    transition: all 0.3s ease;
  }
  
  .submit-button {
    background-color: #007bff;
    color: white;
    padding: 12px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .submit-button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red; /* Style for error messages */
  }
  </style>
  