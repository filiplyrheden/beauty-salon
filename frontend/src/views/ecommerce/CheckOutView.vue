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
          { name: "T-shirt", price: 1999, quantity: 2 }, // $19.99 per T-shirt
          { name: "Sneakers", price: 4999, quantity: 1 }, // $49.99 per pair of sneakers
          { name: "Cap", price: 1499, quantity: 3 }, // $14.99 per cap
        ];

        const response = await axiosInstance.post("/create-checkout-session", {
          line_items: dummyItems.map((item) => ({
            price_data: {
              currency: "SEK",
              product_data: {
                name: item.name, // Item name from dummy data
              },
              unit_amount: item.price, // Price already in cents in dummy data
            },
            quantity: item.quantity, // Quantity from dummy data
          })),
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
