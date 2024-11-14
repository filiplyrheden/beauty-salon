<template>
    <div>
      <CreateProduct @product-created="handleProductCreated" />
      <ProductList :items="productItems" @product-deleted="handleProductDelete" />
    </div>
  </template>
  
  <script>
  import axiosInstance from "@/services/axiosConfig";
  import ProductList from '@/components/ProductList.vue';
  import CreateProduct from '@/components/CreateProduct.vue';
  
  export default {
    name: "CreateProductView",
    components: {
      CreateProduct,
      ProductList,
    },
    data() {
      return {
        productItems: [],
      }
    },
    created() {
      this.getProducts();
    },
    methods: {
      async getProducts() {
        try {
          const response = await axiosInstance.get(`/admin/products`);
          this.productItems = response.data; // Assign API response to items
          console.log(" productItems in parent container");
          console.log(this.productItems);
        } catch (error) {
          console.error("Error fetching products:", error); // Log error for debugging
        }
      },
      handleProductDelete(productId) {
      // Remove the deleted product from the products array
      this.productItems = this.productItems.filter(product => product.product_id !== productId);
      },
      handleProductCreated(newProduct) {
      // Add the new product to the product list without re-fetching from the API
      console.log("newProduct to be added: ", newProduct);
      this.productItems.push(newProduct);
      }
    }
  };
  </script>
  
  <style>
  </style>