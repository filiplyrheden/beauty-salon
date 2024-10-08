<template>
    <div>
      <h2>Add New Product</h2>
      <form @submit.prevent="saveProduct">
        <div>
          <label for="productName">Product Name:</label>
          <input 
            type="text" 
            id="productName" 
            v-model="productName" 
            required
          />
        </div>
  
        <div>
          <label for="description">Description:</label>
          <textarea 
            id="description" 
            v-model="description" 
            required
          ></textarea>
        </div>
  
        <div>
          <label for="productPrice">Price:</label>
          <input 
            type="number" 
            id="productPrice" 
            v-model="productPrice" 
            step="0.01" 
            required
          />
        </div>
  
        <div>
          <label for="stockQuantity">Stock Quantity:</label>
          <input 
            type="number" 
            id="stockQuantity" 
            v-model="stockQuantity" 
            required
          />
        </div>
  
        <div>
          <label for="categoryId">Category ID:</label>
          <input 
            type="number" 
            id="categoryId" 
            v-model="categoryId" 
            required
          />
        </div>
  
        <button type="submit">Add Product</button>
      </form>
  
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        productName: "",
        description: "",
        productPrice: "",
        stockQuantity: "",
        categoryId: "",
        message: "", // For success or error messages
      };
    },
    methods: {
  // Save new product
  async saveProduct() {
    const newProduct = {
      product_name: this.productName,
      description: this.description,
      price: parseFloat(this.productPrice),
      stock_quantity: parseInt(this.stockQuantity),
      category_id: parseInt(this.categoryId),
    };

    try {
      const response = await axios.post("http://localhost:3000/admin/createproducts", newProduct);
      console.log("Response:", response);
      this.message = "Product added successfully! Product ID: " + response.data.product_id; // Ensure correct property access
      this.resetForm(); // Clear form fields after successful submission
    } catch (error) {
      console.error("Error adding product:", error);
      // Check if error response exists
      if (error.response && error.response.data) {
        this.message = "Error adding product: " + error.response.data.error; // Access error message safely
      } else {
        this.message = "Error adding product: " + error.message || "Internal Server Error"; // Fallback error message
      }
    }
  },

  // Reset form fields
  resetForm() {
    this.productName = "";
    this.description = "";
    this.productPrice = "";
    this.stockQuantity = "";
    this.categoryId = "";
  },
}
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  