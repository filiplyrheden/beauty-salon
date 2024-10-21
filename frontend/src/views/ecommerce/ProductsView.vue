<template>
  <div class="products-container">
    <h1>Products</h1>

    <!-- Search Input -->
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search products..."
      class="search-input"
    />

    <!-- Filter Button and Dropdown -->
    <div class="filter-container">
      <button @click="toggleDropdown" class="filter-button">
        Filter by Category
      </button>

      <ul v-if="showDropdown" class="category-dropdown">
        <li
          @click="selectCategory('')"
          :class="{ active: selectedCategory === '' }"
        >
          All Categories
        </li>
        <li
          v-for="category in categories"
          :key="category.category_id"
          @click="selectCategory(category.category_id)"
          :class="{ active: selectedCategory === category.category_id }"
        >
          {{ category.category_name }}
        </li>
      </ul>
    </div>

    <!-- Check if there are any filtered products -->
    <div v-if="filteredProducts.length" class="products-wrapper">
      <div
        v-for="product in filteredProducts"
        :key="product.product_id"
        class="product-card"
      >
        <img
          :src="
            product.images && product.images.length
              ? product.images.find((image) => image.is_primary === 1)
                  ?.image_url || require('@/assets/noImage.png')
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

    <div v-else class="no-products-message">
      <p>No products found.</p>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";

export default {
  name: "CreateProductView",
  data() {
    return {
      productItems: [],
      categories: [], // To store categories
      selectedCategory: "", // To store the selected category ID
      showDropdown: false, // To toggle dropdown visibility
      searchQuery: "", // To store the search query
    };
  },
  computed: {
    // Filter products based on the selected category and search query
    filteredProducts() {
      let filtered = this.productItems;

      // Filter by category if selected
      if (this.selectedCategory) {
        filtered = filtered.filter(
          (product) => product.category.category_id === this.selectedCategory
        );
      }

      // Filter by search query (case insensitive)
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.product_name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
      }

      return filtered; // Return the final filtered products
    },
  },
  created() {
    this.getProducts();
    this.getCategories(); // Fetch categories on component load
  },
  methods: {
    async getProducts() {
      try {
        const response = await axiosInstance.get(`/allproducts`);
        this.productItems = response.data;
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
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.showDropdown = false; // Close dropdown after selection
    },
    handleaddToCart(productId) {
      console.log(`Added product ${productId} to cart.`);
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

.filter-container {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #42b983; /* Change border color on focus */
  outline: none;
}

.filter-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.filter-button:hover {
  background-color: #38a16d;
}

.category-dropdown {
  position: absolute;
  top: 45px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 10px 0;
  margin: 0;
  border-radius: 5px;
  width: 200px;
}

.category-dropdown li {
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.category-dropdown li:hover {
  background-color: #eee;
}

.category-dropdown li.active {
  background-color: #42b983;
  color: white;
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
.no-products-message {
  text-align: center;
  margin-top: 50px;
  font-size: 1.5rem;
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
