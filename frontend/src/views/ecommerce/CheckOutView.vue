<template>
  <div>
    <button @click="handleCheckout">Pay</button>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";

export default {
  methods: {
    async handleCheckout() {
      try {
        const dummyItems = [
          { product_id: 1, quantity: 2 },
          { product_id: 2, quantity: 4 },
          { product_id: 3, quantity: 1 },
        ];

        const response = await axiosInstance.post("/create-checkout-session", {
          dummyItems: dummyItems
        });

        // Manually handle the redirect from the 303 status
        const { url } = response.data;
        window.location.href = url;
      } catch (error) {
        if (error.response && error.response.status === 303) {
          // If 303, redirect manually to the URL in the response
          const redirectUrl = error.response.data.url;
          window.location.href = redirectUrl;
        } else {
          console.error("Error creating checkout session:", error);
        }
      }
    },
  },
};
</script>
