<template>
  <div class="create-product">
    <h2>Add New Product</h2>
    <form id="uploadForm" @submit.prevent="saveProduct" enctype="multipart/form-data">
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
        <label for="categoryId">Category ID</label>
        <input 
          type="number" 
          id="categoryId" 
          v-model="categoryId" 
          required
          placeholder="Enter category ID"
        />
      </div>

      <!-- Sizes Section -->
      <div class="form-group">
        <label for="sizes">Sizes and Prices</label>
        <div v-for="(size, index) in sizes" :key="index" class="size-entry">
          <input 
            v-model="size.sizeName" 
            type="text" 
            placeholder="Size (e.g., 50 ml)" 
            required
          />
          <input 
            v-model.number="size.price" 
            type="number" 
            step="0.01" 
            placeholder="Price (SEK)" 
            required
          />
          <input 
            v-model.number="size.quantity" 
            type="number" 
            placeholder="Quantity (10, 20, 30)" 
            required
          />
          <button @click.prevent="removeSize(index)">Remove</button>
        </div>
        <button @click.prevent="addSize">Add Size</button>
      </div>

      <div class="form-group">
      <label for="primaryImage">Primary Image:</label>
      <input 
        type="file" 
        id="primaryImage" 
        @change="onImageChange($event, 'primary')" 
        accept="image/*" 
      />
    </div>

    <div class="form-group">
      <label for="secondaryImage">Secondary Image:</label>
      <input 
        type="file" 
        id="secondaryImage" 
        @change="onImageChange($event, 'secondary')" 
        accept="image/*" 
      />
    </div>

    <div class="form-group">
      <label for="thirdImage">Third Image:</label>
      <input 
        type="file" 
        id="thirdImage"
        @change="onImageChange($event, 'third')" 
        accept="image/*" 
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
      sizes: [
        { sizeName: "", price: "", quantity: "" }
      ],
      primaryImageFile: null,
      secondaryImageFile: null,
      thirdImageFile: null,
      categoryId: "",
      message: "", // For success or error messages
    };
  },
  methods: {
    addSize() {
      this.sizes.push({ sizeName: "", price: 0, quantity: 0 });
    },
    removeSize(index) {
      this.sizes.splice(index, 1);
    },
  // Method to handle image changes
  onImageChange(event, imageType) {
    const file = event.target.files[0];

    if (imageType === 'primary') {
      this.primaryImageFile = file;
    } else if (imageType === 'secondary') {
      this.secondaryImageFile = file;
    } else if (imageType === 'third') {
      this.thirdImageFile = file;
    }
  },

  // Save new product
  async saveProduct() {
  // Create a new FormData object
  const formData = new FormData();

  // Append product details to the FormData
  formData.append("product_name", this.productName);
  formData.append("description", this.description);
  formData.append("sizes", JSON.stringify(this.sizes));
  formData.append("category_id", parseInt(this.categoryId));

  // Append image files to the FormData
  if (this.primaryImageFile) {
  formData.append("primaryImage", this.primaryImageFile);
  }
  if (this.secondaryImageFile) {
    formData.append("secondaryImage", this.secondaryImageFile);
  }
  if (this.thirdImageFile) {
    formData.append("thirdImage", this.thirdImageFile);
  }

  try {
    const response = await axiosInstance.post(`admin/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    console.log("Response:", response);
    this.message = "Product added successfully! Product ID: " + response.data.product_id;
    this.resetForm();
  } catch (error) {
    console.error("Error adding product:", error);
    if (error.response && error.response.data) {
      this.message = "Error adding product: " + error.response.data.error;
    } else {
      this.message = "Error adding product: " + error.message || "Internal Server Error";
    }
  }
},


    // Reset form fields
    resetForm() {
      this.productName = "";
      this.description = "";
      this.sizes = [{ sizeName: "", price: 0, quantity: 0 }];
      this.primaryImageFile = null;
      this.secondaryImageFile = null;
      this.thirdImageFile = null;
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