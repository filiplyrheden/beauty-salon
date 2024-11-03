<template>
  <div class="product-list">
    <h2>Product List</h2>
    <ul>
      <li v-for="product in items" :key="product.product_id" class="product-card">
        <div class="product-info">
          <p><strong>Name:</strong> {{ product.product_name }}</p>
          <p><strong>ID:</strong> {{ product.product_id }}</p>
          <div class="image-container-wrapper">
            <div class="product-image-container">
              <img :src="getImageUrl(product.image_url_primary)" :alt="product.product_name" class="product-image" />
            </div>
            <div class="product-image-container">
              <img :src="getImageUrl(product.image_url_secondary)" :alt="product.product_name" class="product-image" />
            </div>
            <div class="product-image-container">
              <img :src="getImageUrl(product.image_url_third)" :alt="product.product_name" class="product-image" />
            </div>
          </div>
          <p><strong>Description:</strong> {{ product.description }}</p>
          <p><strong>Category:</strong> {{ product.category.category_name }}</p>
          <p><strong>Created At:</strong> {{ product.created_at }}</p>
          <p><strong>Sizes:</strong></p>
          <div v-if="product.variants.length > 0">
            <ul>
              <li v-for="(variant, index) in product.variants" :key="index">
                <strong v-if="variant.size">{{ variant.size }}</strong> 
                <strong v-if="variant.price && variant.stock_quantity"> - Price: {{ variant.price }} SEK, Stock: {{ variant.stock_quantity }}</strong>
              </li>
            </ul>
          </div>
          <div v-else>
            <p>No sizes available.</p>
          </div>
        </div>
        <div class="action-buttons">
          <button class="delete-btn" @click="deleteProduct(product.product_id)">
            <font-awesome-icon :icon="['fas', 'trash']" /> Delete
          </button>
          <button class="edit-btn" @click="editProduct(product)">
            <font-awesome-icon :icon="['fas', 'edit']" /> Edit
          </button>
        </div>

        <!-- Edit Form -->
        <div v-if="editingProduct && editingProduct.product_id === product.product_id" class="edit-form">
          <h3>Edit Product</h3>
          <div class="form-group">
            <label for="editName">Name:</label>
            <input v-model="editingProduct.product_name" id="editName" type="text" />

            <label for="editDescription">Description:</label>
            <input v-model="editingProduct.description" id="editDescription" type="text" />
          </div>

          <div class="form-group sizesAndPricesWrapper">
            <label for="sizes">Sizes and Prices</label>
            <div v-for="(variant, index) in editingProduct.variants" :key="index" class="size-entry">
              <input 
                v-model="variant.size" 
                type="text" 
                placeholder="Size (e.g., 300 ml)" 
                required
              />
              <input 
                v-model.number="variant.price" 
                type="number" 
                step="0.01" 
                placeholder="Price (SEK)" 
                required
              />
              <input 
                v-model.number="variant.stock_quantity" 
                type="number" 
                placeholder="Stock" 
                required
              />
              <button @click.prevent="removeSize(index)">Remove</button>
            </div>
            <div class="addSize">
              <button @click.prevent="addSize">Add New Size</button>
            </div>
          </div>

          <div class="form-group">
            <label for="property">Egenskaper</label>
            <div v-for="(property, index) in editingProduct.properties" :key="index" class="property-entry">
              <input 
                v-model="editingProduct.properties[index]"
                type="text" 
                placeholder="Property name" 
                required
              />
              <button @click.prevent="removeProperty(index)">Ta bort</button>
            </div>
            <button @click.prevent="addProperty">Lägg till Egenskap</button>
          </div>

          <div class="form-group">
            <label for="usageProducts">Användarinstruktioner</label>
            <textarea 
              id="usageProducts" 
              v-model="editingProduct.usageProducts" 
              placeholder="Enter usage instructions"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="ingredients">Ingredienser</label>
            <div v-for="(ingredient, index) in editingProduct.ingredients" :key="index" class="ingredient-entry">
              <input 
                v-model="editingProduct.ingredients[index]"
                type="text" 
                placeholder="Ingredient name" 
                required
              />
              <button @click.prevent="removeIngredient(index)">Ta Bort</button>
            </div>
            <button @click.prevent="addIngredient">Lägg Till Ingrediens</button>
          </div>

          <div class="editingImageWrapper">
            <div class="form-group">
              <label for="primaryImage">Primary Image:</label>
              <div v-if="editingProduct.image_url_primary" class="currentImagePreview">
                <img :src="getImageUrl(editingProduct.image_url_primary)" alt="Primary Image" class="product-image" />
              </div>
              <input
                type="file"
                id="primaryImage"
                @change="onImageChange($event, 'primary')"
                accept="image/*"
              />
            </div>
  
            <div class="form-group">
              <label for="secondaryImage">Secondary Image:</label>
              <div v-if="editingProduct.image_url_secondary" class="currentImagePreview">
                <img :src="getImageUrl(editingProduct.image_url_secondary)" alt="Secondary Image" class="product-image" />
              </div>
              <input
                type="file"
                id="secondaryImage"
                @change="onImageChange($event, 'secondary')"
                accept="image/*"
              />
            </div>
  
            <div class="form-group">
              <label for="thirdImage">Third Image:</label>
              <div v-if="editingProduct.image_url_third" class="currentImagePreview">
                <img :src="getImageUrl(editingProduct.image_url_third)" alt="Third Image" class="product-image" />
              </div>
              <input
                type="file"
                id="thirdImage"
                @change="onImageChange($event, 'third')"
                accept="image/*"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="featured">Ska denna produkten vara på landningssidan?</label>
            <input 
              type="checkbox"
              v-model="editingProduct.featured"
            />
          </div>    

          <div class="form-buttons">
            <button class="save-btn" @click="saveProduct(editingProduct)">Save Changes</button>
            <button class="cancel-btn" @click="cancelEdit">Cancel</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axiosInstance from '@/services/axiosConfig';

export default {
  name: "ProductList",
  props: {
    items: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      editingProduct: null,
      primaryImageFile: null,
      secondaryImageFile: null,
      thirdImageFile: null,
    };
  },
  methods: {
    deleteProduct(productId) {
      console.log("Deleting product with ID:", productId);
      axiosInstance.delete(`admin/products/${productId}`)
        .then(response => {
          console.log("Product deleted successfully:", response.data);
          this.$emit('product-deleted', productId);
        })
        .catch(error => {
          console.error("Error deleting product:", error.response ? error.response.data : error.message);
        });
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
    getImageUrl(imageName) {
      return imageName;
    },
    addProperty() {
      if (!this.editingProduct.properties) {
        this.editingProduct.properties = [];
      }
      this.editingProduct.properties.push('');
    },
    removeProperty(index) {
      this.editingProduct.properties.splice(index, 1);
    },
    addIngredient() {
      if (!this.editingProduct.ingredients) {
        this.editingProduct.ingredients = [];
      }
      this.editingProduct.ingredients.push('');
    },
    removeIngredient(index) {
      this.editingProduct.ingredients.splice(index, 1);
    },
    editProduct(product) {
      this.editingProduct = JSON.parse(JSON.stringify(product));
    },
    addSize() {
      this.editingProduct.variants.push({ size: '', price: 0, stock_quantity: 0 });
    },
    removeSize(index) {
      this.editingProduct.variants.splice(index, 1);
    },
    saveProduct(product) {
      console.log("Saving product:", product);
      const formData = new FormData();
      formData.append("product_name", product.product_name);
      formData.append("description", product.description);
      formData.append("category_id", product.category.category_id);
      formData.append("product_id", product.product_id);
      formData.append("featured", this.featured);
      formData.append("properties", JSON.stringify(this.properties));
      formData.append("usage_products", this.usageProducts); // Add usage instructions
      formData.append("ingredients", JSON.stringify(this.ingredients)); // Add ingredients

      // Append sizes
      product.variants.forEach((variant, index) => {
        formData.append(`variants[${index}][size]`, variant.size);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][stock_quantity]`, variant.stock_quantity);
      });

      if (this.primaryImageFile) {
        formData.append("primaryImage", this.primaryImageFile);
      }
      if (this.secondaryImageFile) {
        formData.append("secondaryImage", this.secondaryImageFile);
      }
      if (this.thirdImageFile) {
        formData.append("thirdImage", this.thirdImageFile);
      }

      axiosInstance
        .put(`admin/products/${product.product_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Product saved successfully:", response.data);
          alert(`${product.product_name} saved successfully!`);
          this.cancelEdit(); // Reset editing state
        })
        .catch((error) => {
          console.error("Error saving product:", error.response ? error.response.data : error.message);
        });
    },
    cancelEdit() {
      this.editingProduct = null;
      this.primaryImageFile = null;
      this.secondaryImageFile = null;
      this.thirdImageFile = null;
    }
  },
  mounted() {
    console.log("Product items:", this.items);
  }
};
</script>

  
  <style scoped>
  .product-image-container {
  display: flex; /* Use flexbox to arrange images */
  flex-direction: column; /* Arrange images vertically */
  align-items: center; /* Center images horizontally */
  gap: 10px; /* Space between images */
  margin: 20px 0; /* Add margin above and below the container */
  max-width: 100px;
  max-height: 100px;
}

.product-image-container img {
  max-width: 100%; /* Make images responsive */
  height: auto; /* Maintain aspect ratio */
  border-radius: 8px; /* Rounded corners for images */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4); /* Subtle shadow for depth */
}

.product-image-container label {
  font-weight: bold; /* Bold label for better visibility */
  margin-bottom: 5px; /* Space below label */
}
.product-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
.image-container-wrapper{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.addSize{
  margin-top: 10px;
}
.sizesAndPricesWrapper{
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.product-info {
  margin-bottom: 15px;
}

.product-info strong {
  color: #2c3e50;
  min-width: 120px;
  display: inline-block;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.delete-btn {
  background-color: #ff4757;
  color: white;
}

.delete-btn:hover {
  background-color: #ff6b81;
}

.edit-btn {
  background-color: #1e90ff;
  color: white;
}

.edit-btn:hover {
  background-color: #40a9ff;
}

.edit-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 15px;
}

.editingImageWrapper{
display: flex;
gap: 20px;
}

.currentImagePreview img{
  height: 200px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 10px;
}

input:focus {
  outline: none;
  border-color: #1e90ff;
  box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.2);
}

.form-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.save-btn {
  background-color: #2ecc71;
  color: white;
}

.save-btn:hover {
  background-color: #27ae60;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

.cancel-btn:hover {
  background-color: #7f8c8d;
}

hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
}
</style>