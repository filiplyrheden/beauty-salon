<template>
  <div class="products-container">
    <h1>Products</h1>
    <div class="products-wrapper">
      <div
        v-for="product in productItems"
        :key="product.product_id"
        class="product-card"
      >
        <!-- 
        Implement this in the URL response from the API.
        -->
        <img
          :src="
            product.images &&
            product.images.primary &&
            product.images.primary.image_url
              ? product.images.primary.image_url
              : require('@/assets/noImage.png')
          "
          alt="Product Image"
        />

        <router-link :to="'/products/' + product.product_id">
          <h2>{{ product.product_name }}</h2>
          <p>{{ product.description }}</p>
          <p>Price: {{ product.price }} SEK</p>
        </router-link>
        <button @click="handleaddToCart(product.product_id)">
          + Lägg till i korgen
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";

export default {
  name: "CreateProductView",
  components: {},
  data() {
    return {
      productItems: [],
    };
  },
  created() {
    this.getProducts();
  },
  methods: {
    async getProducts() {
      try {
        const response = await axiosInstance.get(`/products`);
        this.productItems = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    handleaddToCart(productId) {
      console.log(`Added product ${productId} to cart.`);
      // Stripe integration eller vår egen cart?
    },
  },
};
</script>

<style scoped>
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.products-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.product-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: calc(33.333% - 40px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}
.product-card img {
  width: 100%;
}
.product-card a {
  text-decoration: none;
  color: #333;
}

.product-card:hover {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

h1 {
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
}

.product-card h2 {
  font-size: 1.5rem;
  color: #42b983;
  margin-bottom: 10px;
}

.product-card p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 15px;
}

button {
  display: block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #38a16d;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .product-card {
    width: calc(50% - 30px);
  }
}

@media (max-width: 768px) {
  .product-card {
    width: calc(100% - 20px);
  }
}
</style>
