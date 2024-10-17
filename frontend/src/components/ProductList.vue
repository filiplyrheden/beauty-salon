<template>
  <div class="product-list">
    <h2>Product List</h2>
    <ul>
      <li v-for="product in items" :key="product.product_id" class="product-card">
        <div class="product-info">
          <p><strong>Name:</strong> {{ product.product_name }}</p>
          <p><strong>ID:</strong> {{ product.product_id }}</p>
          <p><strong>Description:</strong> {{ product.description }}</p>
          <p><strong>Category ID:</strong> {{ product.category_id }}</p>
          <p><strong>Created At:</strong> {{ product.created_at }}</p>
          <p><strong>Price:</strong> ${{ product.price }}</p>
          <p><strong>Stock Quantity:</strong> {{ product.stock_quantity }}</p>
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
            
            <label for="editPrice">Price:</label>
            <input v-model="editingProduct.price" id="editPrice" type="number" />
            
            <label for="editStock">Stock Quantity:</label>
            <input v-model="editingProduct.stock_quantity" id="editStock" type="number" />
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
      };
    },
    methods: {
      deleteProduct(productId) {
        console.log("Deleting product with ID:", productId);
        axiosInstance.delete(`admin/products/${productId}`)
          .then(response => {
            console.log("Product deleted successfully:", response.data);
            // Emit an event to the parent component to delete the product
            this.$emit('product-deleted', productId);
          })
          .catch(error => {
            console.error("Error deleting product:", error.response ? error.response.data : error.message);
          });
      },
      editProduct(product) {
        this.editingProduct = { ...product };
      },
      saveProduct(product) {
        console.log("Saving product:", product);
        axiosInstance.put('admin/products', product)
          .then(response => {
            console.log("Product saved successfully:", response.data);
            alert(product.product_name + " saved successfully!");
          })
          .catch(error => {
            console.error("Error saving product:", error.response ? error.response.data : error.message);
          });
        this.editingProduct = null;
      },
      cancelEdit() {
        this.editingProduct = null;
      }
    },
    mounted() {
      console.log("Product items:", this.items);
    }
  };
  </script>
  
  <style scoped>
.product-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
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