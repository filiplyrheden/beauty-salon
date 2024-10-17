<template>
  <div class="create-product">
    <h2>Add New Product</h2>
    <form @submit.prevent="saveProduct">
      <div class="form-group">
        <label for="productName">Product Name</label>
        <input 
          type="text" 
          id="productName" 
          v-model="productName" 
          required
          placeholder="Enter product name"
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model="description" 
          required
          placeholder="Enter product description"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="productPrice">Price ($)</label>
        <input 
          type="number" 
          id="productPrice" 
          v-model="productPrice" 
          step="0.01" 
          required
          placeholder="0.00"
        />
      </div>

      <div class="form-group">
        <label for="stockQuantity">Stock Quantity</label>
        <input 
          type="number" 
          id="stockQuantity" 
          v-model="stockQuantity" 
          required
          placeholder="Enter quantity"
        />
      </div>

      <div class="form-group">
        <label for="categoryId">Category ID</label>
        <input 
          type="number" 
          id="categoryId" 
          v-model="categoryId" 
          required
          placeholder="Enter category ID"
        />
      </div>

      <button type="submit" class="submit-btn">Add Product</button>
    </form>

    <div v-if="message" 
         :class="['message', message.includes('Error') ? 'error-message' : 'success-message']">
      {{ message }}
    </div>
  </div>
</template>
  
  <script>
  import axiosInstance from '@/services/axiosConfig';
  
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
      const response = await axiosInstance.post(`/products`, newProduct);
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
  
  <style scoped>
.create-product {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

input,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #1e90ff;
  box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.2);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: #27ae60;
}

.submit-btn:active {
  transform: translateY(1px);
}

.message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Optional loading state for button */
.submit-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .create-product {
    padding: 15px;
    margin: 10px;
  }

  h2 {
    font-size: 24px;
  }
}
</style>
  