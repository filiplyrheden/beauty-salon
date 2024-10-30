<template>
  <div class="product-carousel">
    <Carousel :items-to-show="4.4" :items-to-scroll="1" wrap-around>
      <Slide v-for="product in products" :key="product.product_id">
        <div class="product-item">
          <div class="product-image-section">
            <img
              src="../assets/noImage.png"
              :alt="product.name"
              class="product-image"
            />
            <div
              class="card-overlay"
              @mouseleave="hideSizeOptions(product.product_id)"
            >
              <div class="card-overlay-container">
                <div
                  class="select-size"
                  @click="toggleSizeMenu(product.product_id)"
                >
                  <div class="size-toggle">
                    {{
                      product.selectedSize
                        ? product.variants.find(
                            (v) => v.size_id === product.selectedSize
                          )?.size + " (vald)"
                        : product.variants[0]?.size + " (vald)" ||
                          "Välj storlek"
                    }}
                  </div>
                  <font-awesome-icon icon="chevron-up" />
                </div>
                <transition name="size-options">
                  <div
                    v-if="showSizeOptions[product.product_id]"
                    class="size-options"
                  >
                    <p
                      v-if="!product.variants || product.variants.length === 0"
                    >
                      Inga Varianter :()
                    </p>

                    <div
                      v-else
                      v-for="variant in product.variants"
                      :key="variant.size_id"
                    >
                      <div
                        @click="selectSize(product.product_id, variant.size_id)"
                        class="variant-options"
                      >
                        <p>{{ variant.size }}</p>
                        <p>{{ variant.price }} kr</p>
                      </div>
                    </div>
                  </div>
                </transition>
                <button class="add-to-cart" @click="addItemToCart(product)">
                  LÄGG I VARUKORG
                </button>
              </div>
            </div>
          </div>

          <div class="product-info">
            <div class="product-info-header">
              <h3 class="product-name">{{ product.product_name }}</h3>
              <span v-if="product.selectedSize">
                {{
                  product.variants.find(
                    (v) => v.size_id === product.selectedSize
                  )?.price || "0"
                }}
                kr
              </span>
              <span v-else> {{ product.variants[0]?.price || "0" }} kr </span>
            </div>
            <div class="product-description">{{ product.description }}</div>
          </div>
        </div>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<script>
import { Carousel, Slide, Navigation } from "vue3-carousel";
import axiosInstance from "@/services/axiosConfig";

export default {
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  data() {
    return {
      products: [],
      showSizeOptions: {}, // Object to track size option visibility
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axiosInstance.get(`/allproducts`);
        // Initialize selectedSize for each product
        this.products = response.data.map((product) => {
          // If there's only one variant, set selectedSize to its size_id
          const defaultSizeId =
            product.variants && product.variants.length === 1
              ? product.variants[0].size_id
              : null;

          return {
            ...product,
            selectedSize: defaultSizeId, // Initialize selectedSize with the default size_id
          };
        });
        console.log(this.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },

    toggleSizeMenu(productId) {
      this.showSizeOptions[productId] = !this.showSizeOptions[productId];
    },
    hideSizeOptions(productId) {
      this.showSizeOptions[productId] = false;
    },
    selectSize(productId, sizeId) {
      const product = this.products.find((p) => p.product_id === productId);
      product.selectedSize = sizeId; // Set selectedSize for the specific product
      this.showSizeOptions[productId] = false; // Hide size options after selection
      console.log("Selected size for product", productId, ":", sizeId); // Debugging purpose
    },
    addItemToCart(product) {
      // Add product to the cart with the selected size_id
      if (product.selectedSize === null) {
        // Show the size options for the current product if no size is selected
        this.showSizeOptions[product.product_id] = true;
      } else {
        // Proceed to add the product to the cart
        console.log("Adding to cart:", product.selectedSize);
        this.$store.commit("addToCart", {
          product,
          size_id: product.selectedSize,
        });
      }
    },
  },
};
</script>

<style scoped>
.select-size {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 19.6px;
  text-align: left;
  cursor: pointer;
}
.carousel__slide {
  align-items: flex-start;
  width: 100%;
  opacity: 0.5;
}

.carousel__slide--prev,
.carousel__slide--next,
.carousel__slide--active {
  opacity: 1;
}
.product-carousel {
  width: 100%;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.product-item {
  width: 100%;
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.card-overlay:hover .card-overlay-container {
  background-color: rgba(240, 240, 240, 0.9);
}
.card-overlay-container {
  padding: 8px;
}
.product-name {
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  letter-spacing: 0.02em;
  text-align: left;
}
.product-info-header {
  display: flex;
  justify-content: space-between;
}
.product-description {
  font-size: 14px;
  font-weight: 400;
  line-height: 19.6px;
  text-align: left;
}
.product-image-section {
  position: relative;
  width: 100%;
  height: 368px;
  margin-bottom: 10px;
}
.product-image {
  position: absolute;
  top: 0;
  right: 0;
  z-index: -2;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.variant-options {
  display: flex;
  justify-content: space-between;
}
.card-overlay {
  opacity: 0.5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
}
.card-overlay:hover {
  opacity: 1;
}

.size-toggle {
  background: none;
  border: none;
  color: #202020;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  font-weight: 400;
  line-height: 19.6px;
  text-align: left;
}

.size-options {
  z-index: 10;
  width: 100%;
  padding: 0px 10px;
}

.size-options p {
  margin: 0;
  padding: 5px 0;
  cursor: pointer;
  text-align: left;
}

.size-options p:hover {
  opacity: 0.7;
}

.add-to-cart {
  background-color: unset;
  color: black;
  padding: 8px 16px;
  border: 1px solid black;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  width: 100%;
}

.size-options {
  overflow: hidden;
}
.size-options-enter-active,
.size-options-leave-active {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.size-options-enter-from,
.size-options-leave-to {
  max-height: 0;
  opacity: 0;
}
.size-options-enter-to,
.size-options-leave-from {
  max-height: 100px;
  opacity: 1;
}
</style>
