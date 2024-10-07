<template>
  <div>
    <h1>Welcome to the Home Page</h1>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.product_name }}</li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      items: [], // This will store the products
    };
  },
  created() {
    this.getProducts(); // Fetch products when the component is created
  },
  methods: {
    async getProducts() {
      try {
        const response = await axios.get("http://localhost:3000/products");
        this.items = response.data; // Assign API response to items
      } catch (error) {
        console.error("Error fetching products:", error); // Log error for debugging
      }
    },
  },
  name: "HomeView",
};
</script>
