<template>
    <div>
      <h2>Product List</h2>
      <ul>
        <li v-for="product in items" :key="product.product_id">
          <strong>Name:</strong> {{ product.product_name }} <br />
          <strong>ID:</strong> {{ product.product_id }} <br />
          <strong>Description:</strong> {{ product.description }} <br />
          <strong>Category ID:</strong> {{ product.category_id }} <br />
          <strong>Created At:</strong> {{ product.created_at }} <br />
          <strong>Price:</strong> ${{ product.price }} <br />
          <strong>Stock Quantity:</strong> {{ product.stock_quantity }} <br />
  
          <!-- Delete Button -->
          <button @click="deleteProduct(product.product_id)">
            <font-awesome-icon :icon="['fas', 'trash']" />
          </button>
  
          <!-- Edit Button -->
          <br>
          <button @click="editProduct(product)">
            <font-awesome-icon :icon="['fas', 'edit']" />
          </button>
  
          <!-- Edit Form -->
          <div v-if="editingProduct && editingProduct.product_id === product.product_id">
            <h3>Edit Product</h3>
            <label for="editName">Name:</label>
            <input v-model="editingProduct.product_name" id="editName" type="text" />
            <br />
            <label for="editDescription">Description:</label>
            <input v-model="editingProduct.description" id="editDescription" type="text" />
            <br />
            <label for="editPrice">Price:</label>
            <input v-model="editingProduct.price" id="editPrice" type="number" />
            <br />
            <label for="editStock">Stock Quantity:</label>
            <input v-model="editingProduct.stock_quantity" id="editStock" type="number" />
            <br />
            <button @click="saveProduct(editingProduct)">Save Changes</button>
            <button @click="cancelEdit">Cancel</button>
          </div>
  
          <hr />
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
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
        axios.delete(`http://localhost:3000/admin/createproducts/${productId}`)
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
        axios.put('http://localhost:3000/admin/createproducts', product)
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
  