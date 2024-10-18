<template>
    <div v-if="isVisible" class="popup-overlay">
      <div class="popup">
        <h2>Session Expired</h2>
        <p>Your session has expired due to inactivity. Please log in again.</p>
        <button @click="closePopup">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
    },
    methods: {
      closePopup() {
        this.$emit('close');
        this.$router.push('/login');
      },
    },
  };
  </script>
  
  <style>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popup {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
  </style>
  