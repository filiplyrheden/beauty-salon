<template>
  <div v-if="isVisible" class="popup-overlay">
    <div class="popup">
      <h2 class="title">SESSION EXPIRED</h2>
      <p class="text">
        Your session has expired due to inactivity. Please log in again.
      </p>
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
      this.$emit("close");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
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
  z-index: 99;
}
.popup {
  border: 1px solid black;

  display: flex;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  background: white;
  flex-direction: column;
  gap: 16px;
}
.title {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 8px;
}

button {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-weight: 600;
  background-color: black;
  color: white;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid black;
  transition: background-color 0.3s ease;
}

button:hover {
  border: 1px solid black;
  background-color: white;
  color: black;
}
</style>
