<template>
  <div class="product-carousel">
    <Carousel :items-to-show="1" :items-to-scroll="1" wrap-around>
      <Slide v-for="product in products" :key="product.id">
        <div class="product-item">
          <img
            :src="product.image_url_primary"
            :alt="product.name"
            class="product-image"
          />
          <h3>{{ product.product_name }}</h3>
          <p>{{ product.description }}</p>
          <span>{{ product.price }} kr</span>
        </div>
      </Slide>
    </Carousel>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue3-carousel";
import axiosInstance from "@/services/axiosConfig";
export default {
  components: {
    Carousel,
    Slide,
  },
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axiosInstance.get(`/allproducts`);
        this.productItems = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
  },
};
</script>

<style scoped>
.product-carousel {
  max-width: 400px;
  margin: auto;
}
.product-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.product-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
}
</style>
