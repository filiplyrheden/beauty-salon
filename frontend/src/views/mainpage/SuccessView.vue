<template>
  <div class="order-confirmation-container">
    <div class="order-confirmation">
      <!-- Loading State -->
      <p v-if="isLoading">Loading your order details...</p>

      <!-- Error State -->
      <div v-else-if="hasError">
        <h1 class="title">NÅGOT GICK FEL!</h1>
        <p>
          Något gick fel, testa att lägga beställningen igen, om felet kvarstår
          kontakta
          <a :href="emailLink">info@snbeauty.se</a>.
        </p>
      </div>

      <!-- Success State -->
      <div v-else class="order-details">
        <h1 class="title">TACK FÖR DIN BESTÄLLNING</h1>
        <p>
          Vi uppskattar att du handlar hos oss, din beställning
          <strong>#{{ sessionDetails.order_id }}</strong> är för nuvarande
          <strong>{{ sessionDetails.order_status }}</strong
          >.
          <br />
          Du har blivit debiterad
          <strong>{{ formatCurrency(sessionDetails.total_amount) }}</strong
          >.
        </p>
        <p>
          Order Datum:
          <strong>{{ formatDate(sessionDetails.order_date) }}</strong>
        </p>

        <!-- Display Products -->
        <div v-if="sessionDetails.products && sessionDetails.products.length">
          <h2 class="sub-title">PRODUKTER I DIN BESTÄLLNING:</h2>
          <ul>
            <li
              v-for="(product, index) in sessionDetails.products"
              :key="index"
            >
              {{ product.product_name }} ({{ product.size }}) -
              {{ product.quantity }} x
              {{ formatCurrency(product.unit_price) }}
            </li>
          </ul>
        </div>
        <p>
          Om du har några frågor, emaila
          <a :href="emailLink">info@snbeauty.se</a>.
        </p>
      </div>
    </div>
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
      isLoading: false, // Tracks loading state
      hasError: false, // Tracks error state
    };
  },
  methods: {
    async fetchSessionDetails(sessionId) {
      this.isLoading = true;
      this.hasError = false; // Reset error state before fetching
      try {
        const response = await axiosInstance.get(
          `/api/get-session-details?session_id=${sessionId}`
        );
        if (response.data) {
          this.sessionDetails = response.data;
        } else {
          throw new Error("No session details found");
        }
      } catch (error) {
        console.error("Failed to fetch session details", error);
        this.hasError = true; // Set error state if the request fails
      } finally {
        this.isLoading = false; // End loading state
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
    if (sessionId) {
      this.fetchSessionDetails(sessionId);
    } else {
      this.hasError = true;
    }
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

.order-confirmation-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.order-confirmation {
  max-width: 1280px;
  padding: 40px;
  background-color: #f9f9f9;
  border: 1px solid black;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.title {
  font-family: "Playfair Display", serif;
  text-align: center;
  margin-bottom: 32px;
}
.sub-title {
  font-family: "Playfair Display", serif;
  text-align: center;
  margin-bottom: 32px;
  margin-top: 16px;
}
ul {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  align-items: center;
}
.order-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
.order-details p {
  text-align: center;
}

@media (max-width: 768px) {
  .order-confirmation {
    padding: 20px;
    margin: 32px;
  }

  .order-confirmation-container {
    height: auto;
  }
}
</style>
