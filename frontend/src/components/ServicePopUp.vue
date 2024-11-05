<template>
  <div v-if="isVisible" class="popup-overlay">
    <div class="popup">
      <h2>{{ service.name }}</h2>
      <p><strong>Time:</strong> {{ service.time }} min</p>
      <p><strong>Price:</strong> {{ service.price }} SEK</p>
      <p><strong>Description:</strong> {{ service.description }}</p>
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
    service: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closePopup() {
      this.$emit("close");
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
}
.popup {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 10px;
}
button:hover {
  background-color: #0056b3;
}
</style>
