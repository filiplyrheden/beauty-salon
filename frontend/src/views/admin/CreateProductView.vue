<template>
    <div>
      <CreateProduct />
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
        } catch (error) {
          console.error("Error fetching products:", error); // Log error for debugging
        }
      },
      handleProductDelete(productId) {
      // Remove the deleted product from the products array
      this.productItems = this.productItems.filter(product => product.product_id !== productId);
      },
    }
  };
  </script>
  
  <style>
  </style>