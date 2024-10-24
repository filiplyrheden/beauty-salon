<template>
  <div>
    <h1>Thanks for your order!</h1>
    <p v-if="isLoading">Loading your order details...</p>
    <p v-if="!sessionDetails">
      Something went wrong, please email
      <a :href="emailLink">orders@example.com</a>.
    </p>
    <div v-else-if="sessionDetails">
      <p>
        We appreciate your business! Your order
        <strong>#{{ sessionDetails.order_id }}</strong> is currently
        <strong>{{ sessionDetails.order_status }}</strong
        >.
        <br />
        You have been charged
        <strong>{{ formatCurrency(sessionDetails.total_amount) }}</strong
        >.
      </p>
      <p>
        Order Date: <strong>{{ formatDate(sessionDetails.order_date) }}</strong>
      </p>

      <!-- Display products in the order -->
      <div v-if="sessionDetails.products && sessionDetails.products.length">
        <h2>Products in your order:</h2>
        <ul>
          <li v-for="(product, index) in sessionDetails.products" :key="index">
            {{ product.product_name }} - {{ product.quantity }} x
            {{ formatCurrency(product.unit_price) }}
          </li>
        </ul>
      </div>
    </div>

    <p>
      If you have any questions, please email
      <a :href="emailLink">orders@example.com</a>.
    </p>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";

export default {
  name: "SuccessPage",
  data() {
    return {
      emailLink: "mailto:orders@example.com",
      sessionDetails: null, // Holds the session information
      isLoading: false, // Loading state
    };
  },
  methods: {
    async fetchSessionDetails(sessionId) {
      this.isLoading = true; // Set loading state
      try {
        const response = await axiosInstance.get(
          `/api/get-session-details?session_id=${sessionId}`
        );
        this.sessionDetails = response.data;
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch session details", error);
      } finally {
        this.isLoading = false; // Reset loading state
      }
    },
    formatCurrency(amount) {
      return (amount * 1).toLocaleString("sv-SE", {
        style: "currency",
        currency: "SEK",
      });
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    },
  },
  created() {
    localStorage.removeItem("cart");
    const sessionId = this.$route.query.session_id;
    this.fetchSessionDetails(sessionId);
  },
};
</script>

<style scoped>
h1 {
  color: #333;
}
p {
  font-size: 16px;
}
a {
  color: #007bff;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
