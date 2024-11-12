<template>
  <div>
    <div class="product-grid">
      <div
        v-for="product in productItems"
        :key="product.product_id"
        class="product-item"
      >
        <div class="product-image-section">
          <img
            v-if="product.image_url_primary"
            class="product-image"
            :src="product.image_url_primary"
            alt=""
          />
          <img
            v-if="!product.image_url_primary"
            src="../assets/noImage.png"
            :alt="product.product_name"
            class="product-image"
          />
          <div class="card-overlay">
            <div class="card-overlay-container-mobile">
              <button @click="toggleBuyMobile(product)">
                <div class="buyMobileWrapper">
                  <img src="../assets/buymobilelogo.svg" alt="" />
                </div>
              </button>
            </div>
          </div>
        </div>
        <router-link :to="'/products/' + product.product_id">
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
              <span v-else>{{ product.variants[0]?.price || "0" }} kr</span>
            </div>
            <div class="product-description">{{ product.description }}</div>
            <p class="mobilePrice" v-if="product.selectedSize">
              {{
                product.variants.find((v) => v.size_id === product.selectedSize)
                  ?.price || "0"
              }}
              kr
            </p>
          </div>
        </router-link>
      </div>
    </div>
    <MobileSizePicker
      v-if="showSizesMobile"
      :product="selectedProduct"
      @close="showSizesMobile = false"
      @add-to-cart="addItemToCart"
    />
  </div>
</template>
<script>
import axiosInstance from "@/services/axiosConfig";
import MobileSizePicker from "./MobileSizePicker.vue";

export default {
  name: "ProductsPage",
  components: {
    MobileSizePicker,
  },
  data() {
    return {
      productItems: [],
      showSizeOptions: {}, // Object to track size option visibility
      showSizesMobile: false,
      selectedProduct: null,
      properties: [],
    };
  },

  created() {
    this.fetchProducts();
  },

  methods: {
    async fetchProducts() {
      try {
        const response = await axiosInstance.get(`/featuredproducts`);
        // Initialize selectedSize for each product
        this.productItems = response.data.map((product) => {
          const defaultSizeId = product.variants
            ? product.variants[0].size_id
            : null;

          return {
            ...product,
            selectedSize: defaultSizeId, // Initialize selectedSize with the default size_id
          };
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    toggleBuyMobile(product) {
      this.selectedProduct = product;
      this.showSizesMobile = true;
    },
    addItemToCart({ product, size }) {
      this.$store.commit("addToCart", { product, size_id: size.size_id });
      this.showSizesMobile = false;
    },
  },
};
</script>

<style scoped>
.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.product-item {
  width: calc(33% - 17.2px);
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.product-item a {
  text-decoration: none;
  color: black;
  cursor: pointer;
}
a:hover {
  transform: scale(1.01);
  transition: transform 0.3s ease;
}

.card-overlay:hover .card-overlay-container {
  background-color: rgba(240, 240, 240, 0.9);
}
.card-overlay:hover .card-overlay-container button {
  background-color: black;
  color: white;
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

  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.product-image-section {
  position: relative;
  width: 100%;
  height: 350px;
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

.card-overlay-container-mobile {
  display: none;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(0);
}

.extraselect-size {
  gap: 20px;
  width: 100%;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(0);
}

@media (max-width: 767px) {
  .products-header h1 {
    font-size: 30px;
  }
  .products-header {
    flex-direction: column;
  }
  .search {
    width: 100%;
  }

  .card-overlay {
    opacity: 1;
  }

  .card-overlay-container {
    display: none;
  }

  .card-overlay-container-mobile {
    display: flex;
    justify-content: end;
    padding: 10px;
    opacity: 1;
  }

  .buyMobileWrapper {
    height: 40px;
    width: 40px;
    background-color: black;
    border-radius: 30px;
    opacity: 1;
  }

  .card-overlay-container-mobile button {
    border: none;
    background-color: transparent;
  }

  .showSizesMobileWrapper {
    display: flex;
  }

  .filter-container {
    display: none;
  }
  .filter-header-mobile {
    display: flex;
  }
  .filter {
    display: flex;
    padding-left: 20px;
    width: 100%;
    justify-content: space-between;
  }
  .top-products-wrapper {
    gap: 25px;
    width: 100%;
  }
  .product-item {
    width: calc(49% - 17.2px);
    height: 320px;
  }
  .product-info-header span {
    display: none;
  }
  .product-name {
    font-size: 12px;
  }
  .mobilePrice {
    display: flex;
  }

  .add-to-cart {
    padding: 4px 8px;
    font-size: 12px;
  }
}

@media (max-width: 340px) {
  .product-item {
    width: calc(100% - 17.2px);
  }
}
</style>
e
