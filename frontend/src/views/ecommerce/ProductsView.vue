<template>
  <div class="products-container">
    <div class="products-header">
      <h1>Alla Produkter</h1>
      <div class="search">
        <img src="../../assets/Search_Magnifying_Glass.svg" alt="" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search products..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Products Container Wrapper -->
    <div class="products-container-wrapper">
      <!-- Filter Container -->
      <div class="filter-container">
        <!-- Accordion for Category Filter -->
        <div class="filter-header">
          <img src="../../assets/filter.svg" alt="" />
          <h2>Filter</h2>
        </div>

        <div class="accordion">
          <div @click="toggleDropdown" class="accordion-header">
            <h3 class="filter-title">Category</h3>
            <span class="accordion-icon" :class="{ open: showDropdown }"
              ><font-awesome-icon icon="chevron-down"
            /></span>
          </div>

          <!-- Accordion Content (Category Dropdown with Checkboxes) -->
          <ul v-if="showDropdown" class="category-dropdown">
            <li>
              <label>
                <input
                  type="checkbox"
                  @change="toggleCategorySelection('')"
                  :checked="selectedCategories.includes('')"
                />
                All Categories
              </label>
            </li>
            <li v-for="category in categories" :key="category.category_id">
              <label>
                <input
                  type="checkbox"
                  @change="toggleCategorySelection(category.category_id)"
                  :checked="selectedCategories.includes(category.category_id)"
                />
                {{ category.category_name }}
              </label>
            </li>
          </ul>
        </div>
        <div class="accordion">
          <div @click="toggleDropdown" class="accordion-header">
            <h3 class="filter-title">Category</h3>
            <span class="accordion-icon" :class="{ open: showDropdown }"
              ><font-awesome-icon icon="chevron-down"
            /></span>
          </div>

          <!-- Accordion Content (Category Dropdown with Checkboxes) -->
          <ul v-if="showDropdown" class="category-dropdown">
            <li>
              <label>
                <input
                  type="checkbox"
                  @change="toggleCategorySelection('')"
                  :checked="selectedCategories.includes('')"
                />
                All Categories
              </label>
            </li>
            <li v-for="category in categories" :key="category.category_id">
              <label>
                <input
                  type="checkbox"
                  @change="toggleCategorySelection(category.category_id)"
                  :checked="selectedCategories.includes(category.category_id)"
                />
                {{ category.category_name }}
              </label>
            </li>
          </ul>
        </div>
        <div class="accordion">
          <div @click="toggleDropdown" class="accordion-header">
            <h3 class="filter-title">Category</h3>
            <span class="accordion-icon" :class="{ open: showDropdown }"
              ><font-awesome-icon icon="chevron-down"
            /></span>
          </div>

          <!-- Accordion Content (Category Dropdown with Checkboxes) -->
          <ul v-if="showDropdown" class="category-dropdown">
            <li>
              <label>
                <input
                  type="checkbox"
                  @change="toggleCategorySelection('')"
                  :checked="selectedCategories.includes('')"
                />
                All Categories
              </label>
            </li>
            <li v-for="category in categories" :key="category.category_id">
              <label>
                <input
                  type="checkbox"
                  @change="toggleCategorySelection(category.category_id)"
                  :checked="selectedCategories.includes(category.category_id)"
                />
                {{ category.category_name }}
              </label>
            </li>
          </ul>
        </div>
      </div>

      <!-- Products Wrapper -->
      <div class="top-products-wrapper">
        <!-- Sort Dropdown -->
        <div class="filter">
          <select v-model="sortOption">
            <option value="">Sortera efter</option>
            <option value="alphabeticalAsc">Alfabetisk A - Ö</option>
            <option value="alphabeticalDesc">Alfabetisk Ö - A</option>
            <option value="priceAsc">Pris Lägst - Högst</option>
            <option value="priceDesc">Pris Högst - Lägst</option>
          </select>
        </div>

        <!-- Product Cards -->
        <div v-if="filteredProducts.length" class="products-wrapper">
          <div
            v-for="product in filteredProducts"
            :key="product.product_id"
            class="product-item"
          >
            <div class="product-image-section">
              <img
                src="../../assets/noImage.png"
                :alt="product.product_name"
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
                        v-if="
                          !product.variants || product.variants.length === 0
                        "
                      >
                        Inga Varianter :()
                      </p>
                      <div
                        v-else
                        v-for="variant in product.variants"
                        :key="variant.size_id"
                      >
                        <div
                          @click="
                            selectSize(product.product_id, variant.size_id)
                          "
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
                <span v-else>{{ product.variants[0]?.price || "0" }} kr</span>
              </div>
              <div class="product-description">{{ product.description }}</div>
            </div>
          </div>
        </div>

        <div v-else class="no-products-message">
          <p>No products found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "ProductsPage",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      productItems: [],
      showDropdown: false,
      selectedCategories: [],
      categories: [],
      searchQuery: "",
      sortOption: "",
      showSizeOptions: {}, // Object to track size option visibility
    };
  },

  computed: {
    filteredProducts() {
      let filtered = this.productItems;

      // Filter by selected categories
      if (
        this.selectedCategories.length > 0 &&
        !this.selectedCategories.includes("")
      ) {
        filtered = filtered.filter((product) =>
          this.selectedCategories.includes(product.category.category_id)
        );
      }

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.product_name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
      }

      return filtered.sort((a, b) => {
        const lowestPriceA = this.getLowestPrice(a);
        const lowestPriceB = this.getLowestPrice(b);

        switch (this.sortOption) {
          case "alphabeticalAsc":
            return a.product_name.localeCompare(b.product_name);
          case "alphabeticalDesc":
            return b.product_name.localeCompare(a.product_name);
          case "priceAsc":
            return lowestPriceA - lowestPriceB;
          case "priceDesc":
            return lowestPriceB - lowestPriceA;
          default:
            return 0;
        }
      });
    },
  },

  created() {
    this.getProducts();
    this.getCategories();
  },

  methods: {
    async getProducts() {
      try {
        const response = await axiosInstance.get(`/allproducts`);
        this.productItems = response.data.map((product) => ({
          ...product,
          selectedSize: product.variants?.[0]?.size_id || null,
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },

    async getCategories() {
      try {
        const response = await axiosInstance.get(`/categories`);
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },

    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    toggleCategorySelection(categoryId) {
      if (this.selectedCategories.includes(categoryId)) {
        // Remove category if already selected
        this.selectedCategories = this.selectedCategories.filter(
          (id) => id !== categoryId
        );
      } else {
        // Add category to selected list
        this.selectedCategories.push(categoryId);
      }
    },

    toggleSizeMenu(productId) {
      this.showSizeOptions[productId] = !this.showSizeOptions[productId];
    },

    hideSizeOptions(productId) {
      this.showSizeOptions[productId] = false;
    },

    selectSize(productId, sizeId) {
      const product = this.productItems.find((p) => p.product_id === productId);
      if (product) {
        product.selectedSize = sizeId;
        this.showSizeOptions[productId] = false;
      }
    },

    addItemToCart(product) {
      if (product.selectedSize === null) {
        this.showSizeOptions[product.product_id] = true;
      } else {
        this.$store.commit("addToCart", {
          product,
          size_id: product.selectedSize,
        });
      }
    },

    getLowestPrice(product) {
      return product.variants && product.variants.length > 0
        ? Math.min(...product.variants.map((variant) => variant.price))
        : null;
    },
  },
};
</script>

<style scoped>
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
.products-header {
  margin: 48px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.products-container-wrapper {
  display: flex;
  gap: 20px;
}

h1 {
  font-family: "Playfair Display", serif;
  font-size: 47.78px;
  font-weight: 600;
  line-height: 52.56px;
  letter-spacing: 0.04em;
  text-align: left;
}
h2 {
  font-family: "Playfair Display", serif;
  font-size: 19.2px;
  font-weight: 600;
  line-height: 21.12px;
  letter-spacing: 0.02em;
  text-align: left;
}
h3 {
  font-family: "Outfit";
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  letter-spacing: 0.02em;
  text-align: left;
}
.filter-title {
  font-weight: 400;
}
.filter-header {
  display: flex;
  gap: 10px;
  margin-bottom: 32px;
}
.filter-container {
  width: 25%;
  padding: 10px;
  height: fit-content;
  position: sticky;
  top: 130px;
  margin-bottom: 26%;
}
.filter {
  align-self: flex-end;
  margin-right: 10px;
}

select {
  border: none;
}

.category-dropdown {
  padding: 10px;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.category-dropdown li {
  padding: 5px 0;
}

.products-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.top-products-wrapper {
  display: flex;
  width: 75%;
  flex-direction: column;
}

.accordion-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid black;
  padding: 12px 0px;
}

.accordion-icon.open {
  transform: rotate(180deg);
}

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
  height: 300px;
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
.search-input {
  width: 100%;
  padding: 8px 37px 8px 10px;
}
.search {
  display: flex;
  gap: 10px;
  position: relative;
  width: 25%;
}

.search img {
  position: absolute;
  right: 10px;
  top: 50%;
  right: 10px;
  transform: translate(0px, -50%);
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
