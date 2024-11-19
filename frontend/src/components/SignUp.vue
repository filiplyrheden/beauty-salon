<template>
    <div class="newsletter-container">
        <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
        <div class="newsletter">
            <div class="letter">
            <h2>Nyhetsbrev</h2>
            <p>Skriv upp dig för de senaste nyheterna kring våra event och kurser samt erbjudanden</p>
            <form @submit.prevent="handleSignup">
                <div class="form-group">
                    <input 
                        id="email" 
                        type="email" 
                        placeholder="Skriv in din email address"
                        v-model="email" 
                        required
                    />
                    <button type="submit">REGISTRERA</button>

                </div>
            </form>
        </div>
    </div>
    </div>
</template>

<script>
import axiosInstance from '@/services/axiosConfig';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            email: '', // This binds to the input field for the email
            isLoading: false,
        };
    },
    methods: {
        async handleSignup() {
            const signupData = {
                email: this.email,
            };
            try {
                this.isLoading = true;
                // Make the API request to sign up for the newsletter
                 await axiosInstance.post('/newsletter', signupData);
                this.isLoading = false;
                // Display a success alert
                Swal.fire("Success", "Du har registrerat dig!", "success");
                // Clear email field after success
                this.email = '';
                
            } catch (error) {
                console.error('Error signing up:', error);
                // Display an error alert if signup fails
                this.isLoading = false;
                Swal.fire("Error", "Kunde inte signa upp, testa igen.", "error");
            }
        },
    },
};
</script>

<style scoped>
.newsletter-container {
    width: 100%;
    background-color: #f1f1f1;
}

.newsletter {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.letter {
    display: flex;
    flex-direction: column;
    gap:16px;
}

.newsletter h2 {
    font-family: "Playfair Display", serif !important;
  font-size: 33.18px;
  font-weight: 600;
  line-height: 36.5px;
  letter-spacing: 0.02em;
  text-align: center;
  color: rgba(32, 32, 32, 0.5);
}

.newsletter p {
    font-size: 16px;
    
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

input {
    width: 100%;
    padding: 10px;
    border: 1px solid black;
   
}
button {
    font-family: "Playfair Display", serif !important;
    padding: 8px;
    color: white;
    background-color: black;
    border: 1px solid black;
    cursor: pointer;
    font-weight: 600;
}
button:hover {
    background-color: white;
    color: black;
}

.form-group {
    display: flex;
    gap: 10px;
}

</style>
