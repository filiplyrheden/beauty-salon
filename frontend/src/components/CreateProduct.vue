<template>
  <div class="create-product">
    <h2>Add New Product</h2>
    <form id="uploadForm" @submit.prevent="saveProduct" enctype="multipart/form-data">
      <!-- Existing Fields -->
      <div class="form-group">
        <label for="productName">Produktnamn</label>
        <input 
          type="text" 
          id="productName" 
          v-model="productName" 
          required
          placeholder="Enter product name"
        />
      </div>

      <div class="form-group">
        <label for="description">Beskrivning</label>
        <textarea 
          id="description" 
          v-model="description" 
          required
          placeholder="Enter product description"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="categoryId">Category ID ÄNDRA</label>
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
        <label for="sizes">Storlekar och Priser</label>
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
          <button @click.prevent="removeSize(index)">Ta Bort</button>
        </div>
        <button @click.prevent="addSize">Lägg Till Storlek</button>
      </div>

      <!-- Usage Products Section -->
      <div class="form-group">
        <label for="usageProducts">Användarinstruktioner</label>
        <textarea 
          id="usageProducts" 
          v-model="usageProducts" 
          placeholder="Enter usage instructions"
        ></textarea>
      </div>

      <!-- Ingredients Section -->
      <div class="form-group">
        <label for="ingredients">Ingredienser</label>
        <div v-for="(ingredient, index) in ingredients" :key="index" class="ingredient-entry">
          <input 
            v-model="ingredients[index]"
            type="text" 
            placeholder="Ingredient name" 
            required
          />
          <button @click.prevent="removeIngredient(index)">Ta Bort</button>
        </div>
        <button @click.prevent="addIngredient">Lägg Till Ingrediens</button>
      </div>


      <!-- Image Fields and Submit Button -->
      <div class="form-group">
        <label for="primaryImage">Första Bilden:</label>
        <input 
          type="file" 
          id="primaryImage" 
          @change="onImageChange($event, 'primary')" 
          accept="image/*" 
        />
      </div>

      <div class="form-group">
        <label for="secondaryImage">Andra Bilden:</label>
        <input 
          type="file" 
          id="secondaryImage" 
          @change="onImageChange($event, 'secondary')" 
          accept="image/*" 
        />
      </div>

      <div class="form-group">
        <label for="thirdImage">Tredje Bilden:</label>
        <input 
          type="file" 
          id="thirdImage"
          @change="onImageChange($event, 'third')" 
          accept="image/*" 
        />
      </div>
      <!-- Ingredients Section -->
      <div class="form-group">
        <label for="property">Egenskaper</label>
        <div v-for="(property, index) in properties" :key="index" class="property-entry">
          <input 
            v-model="properties[index]"
            type="text" 
            placeholder="Property name" 
            required
          />
          <button @click.prevent="removeProperty(index)">Ta bort</button>
        </div>
        <button @click.prevent="addProperty">Lägg till Egenskap</button>
      </div>

      <div class="form-group">
        <label for="featured">Ska denna produkten vara på landningssidan?</label>
        <input 
        :value="true"
        type="radio"
        id="featured"
        v-model="featured"
        >
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
      usageProducts: "",
      ingredients: [""],
      properties: [""],
      featured: false,
      primaryImageFile: null,
      secondaryImageFile: null,
      thirdImageFile: null,
      categoryId: "",
      message: "",
    };
  },
  methods: {
    addSize() {
      this.sizes.push({ sizeName: "", price: 0, quantity: 0 });
    },
    removeSize(index) {
      this.sizes.splice(index, 1);
    },
    addIngredient() {
      this.ingredients.push("");
    },
    removeIngredient(index) {
      this.ingredients.splice(index, 1);
    },
    addProperty() {
      this.properties.push("");
    },
    removeProperty(index) {
      this.properties.splice(index, 1);
    },
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
    async saveProduct() {
      const formData = new FormData();
      formData.append("product_name", this.productName);
      formData.append("description", this.description);
      formData.append("sizes", JSON.stringify(this.sizes));
      formData.append("usage_products", this.usageProducts);
      formData.append("ingredients", JSON.stringify(this.ingredients));
      formData.append("category_id", parseInt(this.categoryId));
      formData.append("featured", this.featured);
      formData.append("properties", JSON.stringify(this.properties));

      if (this.primaryImageFile) formData.append("primaryImage", this.primaryImageFile);
      if (this.secondaryImageFile) formData.append("secondaryImage", this.secondaryImageFile);
      if (this.thirdImageFile) formData.append("thirdImage", this.thirdImageFile);

      try {
        const response = await axiosInstance.post(`admin/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log("Response:", response);
        this.message = "Product added successfully!";
        this.resetForm();
      } catch (error) {
        console.error("Error adding product:", error);
        this.message = error.response?.data?.error || error.message || "Internal Server Error";
      }
    },
    resetForm() {
      this.productName = "";
      this.description = "";
      this.sizes = [{ sizeName: "", price: 0, quantity: 0 }];
      this.usageProducts = "";
      this.ingredients = [""];
      this.properties = [""];
      this.featured = false;
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