<template>
  <div class="products-container">
    <div class="products-header">
      <h1>Alla Produkter</h1>
      <div class="search">
        <img src="../../assets/Search_Magnifying_Glass.svg" alt="" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Sök bland produkter"
          class="search-input"
        />
      </div>
    </div>

    <!-- Slide-out Popup for Mobile Filters -->
    <transition name="slide">
      <div :class="['filter-popup', { open: showFilterPopup }]">
        <!-- Popup Header -->
        <div class="filter-popup-header">
          <h2>Filter</h2>
          <button class="" @click="toggleFilterPopup">
            <img src="@/assets/x.svg" alt="" />
          </button>
        </div>

        <!-- Category Filter Accordion -->
        <div class="accordion">
          <div @click="toggleDropdown('category')" class="accordion-header">
            <h3 class="filter-title">Kategori</h3>
            <span
              class="accordion-icon"
              :class="{ open: showDropdown.category }"
            >
              <font-awesome-icon icon="chevron-down" />
            </span>
          </div>
          <transition name="accordion">
            <ul v-if="showDropdown.category" class="category-dropdown">
              <li>
                <label>
                  <input
                    type="checkbox"
                    @change="toggleCategorySelection('')"
                    :checked="selectedCategories.includes('')"
                  />
                  Alla Kategorier
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
          </transition>
        </div>

        <!-- Properties Filter Accordion -->
        <div class="accordion">
          <div @click="toggleDropdown('properties')" class="accordion-header">
            <h3 class="filter-title">Egenskaper</h3>
            <span
              class="accordion-icon"
              :class="{ open: showDropdown.properties }"
            >
              <font-awesome-icon icon="chevron-down" />
            </span>
          </div>
          <transition name="accordion">
            <ul v-if="showDropdown.properties" class="properties-dropdown">
              <li v-for="property in properties" :key="property.id">
                <label>
                  <input
                    type="checkbox"
                    @change="togglePropertySelection(property.name)"
                    :checked="selectedProperties.includes(property.name)"
                  />
                  {{ property.name }}
                </label>
              </li>
            </ul>
          </transition>
        </div>

        <!-- Brand Filter Accordion -->
        <div class="accordion">
          <div @click="toggleDropdown('brand')" class="accordion-header">
            <h3 class="filter-title">Märke</h3>
            <span class="accordion-icon" :class="{ open: showDropdown.brand }">
              <font-awesome-icon icon="chevron-down" />
            </span>
          </div>
          <transition name="accordion">
            <ul v-if="showDropdown.brand" class="category-dropdown">
              <li>
                <label>
                  <input
                    type="checkbox"
                    @change="toggleBrandSelection('')"
                    :checked="selectedBrands.includes('')"
                  />
                  Alla Märken
                </label>
              </li>
              <li v-for="brand in brands" :key="brand.brand_id">
                <label>
                  <input
                    type="checkbox"
                    @change="toggleCategorySelection(brand.brand_id)"
                    :checked="selectedCategories.includes(brand.brand_id)"
                  />
                  {{ brand.brand_name }}
                </label>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </transition>

    <!-- Products Container Wrapper -->
    <div class="products-container-wrapper">
      <!-- Filter Container -->
      <div class="filter-container">
        <!-- Accordion for Category Filter -->
        <div class="filter-header">
          <img src="../../assets/filter.svg" alt="" />
          <h2>Filter</h2>
        </div>
        <!-- Category Accordion -->
        <div class="accordion">
          <div @click="toggleDropdown('category')" class="accordion-header">
            <h3 class="filter-title">Kategori</h3>
            <span
              class="accordion-icon"
              :class="{ open: showDropdown.category }"
            >
              <font-awesome-icon icon="chevron-down" />
            </span>
          </div>

          <!-- Wrap in transition for sliding effect -->
          <transition name="accordion">
            <ul v-if="showDropdown.category" class="category-dropdown">
              <li>
                <label>
                  <input
                    type="checkbox"
                    @change="toggleCategorySelection('')"
                    :checked="selectedCategories.includes('')"
                  />
                  Alla Kategorier
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
          </transition>
        </div>

        <!-- Accordion for Properties Filter -->
        <div class="accordion">
          <div @click="toggleDropdown('properties')" class="accordion-header">
            <h3 class="filter-title">Egenskaper</h3>
            <span
              class="accordion-icon"
              :class="{ open: showDropdown.properties }"
            >
              <font-awesome-icon icon="chevron-down" />
            </span>
          </div>
          <!-- Wrap in transition for sliding effect -->
          <transition name="accordion">
            <ul v-if="showDropdown.properties" class="properties-dropdown">
              <li v-for="property in properties" :key="property.id">
                <label>
                  <input
                    type="checkbox"
                    @change="togglePropertySelection(property.name)"
                    :checked="selectedProperties.includes(property.name)"
                  />
                  {{ property.name }}
                </label>
              </li>
            </ul>
          </transition>
        </div>
        <div class="accordion">
          <div @click="toggleDropdown('brand')" class="accordion-header">
            <h3 class="filter-title">Märke</h3>
            <span class="accordion-icon" :class="{ open: showDropdown.brand }">
              <font-awesome-icon icon="chevron-down" />
            </span>
          </div>
          <!-- Wrap in transition for sliding effect -->
          <transition name="accordion">
            <ul v-if="showDropdown.brand" class="category-dropdown">
              <li>
                <label>
                  <input
                    type="checkbox"
                    @change="toggleBrandSelection('')"
                    :checked="selectedBrands.includes('')"
                  />
                  Alla Märken
                </label>
              </li>
              <li v-for="brand in brands" :key="brand.brand_id">
                <label>
                  <input
                    type="checkbox"
                    @change="toggleCategorySelection(brand.brand_id)"
                    :checked="selectedCategories.includes(brand.brand_id)"
                  />
                  {{ brand.brand_name }}
                </label>
              </li>
            </ul>
          </transition>
        </div>
      </div>

      <!-- Products Wrapper -->
      <div class="top-products-wrapper">
        <!-- Sort Dropdown -->
        <div class="filter">
          <div class="filter-header-mobile" @click="toggleFilterPopup">
            <img src="../../assets/filter.svg" alt="" />
            <h2>Filter</h2>
          </div>
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
                v-if="product.image_url_primary"
                class="product-image"
                :src="product.image_url_primary"
                alt=""
              />
              <img
                v-if="!product.image_url_primary"
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
                    product.variants.find(
                      (v) => v.size_id === product.selectedSize
                    )?.price || "0"
                  }}
                  kr
                </p>
              </div>
            </router-link>
          </div>
        </div>

        <div v-else class="no-products-message">
          <p>Inga produkter hittades</p>
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
      showDropdown: {
        category: false,
        properties: false,
      },
      showFilterPopup: false,
      selectedCategories: [],
      selectedBrands: [],
      selectedProperties: [],
      categories: [],
      brands: [],
      searchQuery: "",
      sortOption: "",
      showSizeOptions: {}, // Object to track size option visibility
      properties: [],
    };
  },

  computed: {
    filterSections() {
      return [
        {
          title: "Category",
          type: "category",
          items: this.categories,
        },
        {
          title: "Properties",
          type: "properties",
          items: this.properties,
        },
        {
          title: "Brand",
          type: "brand",
          items: this.brands,
        },
      ];
    },
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
      if (this.selectedBrands.length > 0 && !this.selectedBrands.includes("")) {
        filtered = filtered.filter((product) =>
          this.selectedBrands.includes(product.brand.brand_id)
        );
      }
      if (this.selectedProperties.length > 0) {
        filtered = filtered.filter((product) => {
          // Convert properties to an array if it's an object or ensure it's an empty array if undefined
          const propertiesArray = Array.isArray(product.properties)
            ? product.properties
            : product.properties
            ? Object.values(product.properties)
            : [];

          // Now perform the filtering based on selectedProperties
          return propertiesArray.some((property) =>
            this.selectedProperties.includes(property.name)
          );
        });
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
    this.getProperties();
    this.getBrands();
  },

  methods: {
    async getBrands() {
      try {
        const response = await axiosInstance.get(`/brands`);
        this.brands = response.data;
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    },
    async getProperties() {
      try {
        const response = await axiosInstance.get(`/productproperties`);
        this.properties = response.data;
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    },
    async getProducts() {
      try {
        const response = await axiosInstance.get(`/allproducts`);
        this.productItems = response.data.map((product) => ({
          ...product,
          selectedSize: product.variants?.[0]?.size_id || null,
        }));
        console.log(this.productItems);
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

    toggleDropdown(type) {
      this.showDropdown[type] = !this.showDropdown[type];
    },

    toggleFilterPopup() {
      this.showFilterPopup = !this.showFilterPopup;
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
    togglePropertySelection(propertyName) {
      if (this.selectedProperties.includes(propertyName)) {
        this.selectedProperties = this.selectedProperties.filter(
          (prop) => prop !== propertyName
        );
      } else {
        this.selectedProperties.push(propertyName);
      }
    },
    toggleBrandSelection(brandId) {
      if (this.selectedBrands.includes(brandId)) {
        // Remove category if already selected
        this.selectedBrands = this.selectedBrands.filter(
          (id) => id !== brandId
        );
      } else {
        // Add category to selected list
        this.selectedBrands.push(brandId);
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

.category-dropdown,
.properties-dropdown {
  padding: 10px;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.category-dropdown li,
.properties-dropdown li {
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
  transition: transform 0.3s ease;
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
.product-item a {
  text-decoration: none;
  color: black;
  cursor: pointer;
}
.filter-header-mobile {
  display: none;
  gap: 5px;
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

.card-overlay-container {
  padding: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
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
  font-family: "Playfair Display", serif;
  transition: background-color 0.3s ease, color 0.3s ease;
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
.mobilePrice {
  display: none;
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

.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px; /* Set a maximum height that accommodates the content */
  opacity: 1;
  overflow: hidden;
}

.filter-popup {
  padding-top: 200px;
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 50px;
  opacity: 1; /* Keep the popup itself fully opaque */
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 100%;
  height: 100%;
  background-color: rgba(
    255,
    255,
    255,
    0.65
  ); /* Semi-transparent white background */
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;

  /* Apply blur effect behind the popup */
  backdrop-filter: blur(5px); /* Adjust the blur intensity as needed */
  -webkit-backdrop-filter: blur(5px); /* For Safari compatibility */
}

.filter-popup.open {
  transform: translateX(0);
}

.filter-popup .filter-popup-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #000000;
}

.filter-popup-header button {
  border: none;
  cursor: pointer;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
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
