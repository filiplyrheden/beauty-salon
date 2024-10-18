<template>
    <div class="productWrapper">
      <div class="wrapperLeft">
        <img :src="product.imageUrl" alt="Product Picture" />
      </div>
      <div class="wrapperRight">
        <ul>
          <li><strong>Name:</strong> {{ product.product_name }}</li>
          <li><strong>Description:</strong> {{ product.description }}</li>
          <li><strong>Contains:</strong> {{ product.price }}</li>
          <li><strong>Material:</strong> {{ product.stock_quantity }}</li>
          <li><strong>Other Info:</strong> {{ product.category_name }}</li>
        </ul>
        <textarea v-model="product.description" id="productDescription"></textarea>
      </div>
    </div>
  </template>
  
  <script>
  import axiosInstance from '@/services/axiosConfig';
  
  export default {
    name: 'ProductView',
    data() {
      return {
        product: {},
      };
    },
    methods: {
      async fetchProduct() {
        const productId = this.$route.params.id;
        try {
          const response = await axiosInstance.get(`/product/${productId}`);
          this.product = response.data.result; 
          console.log(this.product);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      },
    },
    created() {
      this.fetchProduct();
    },
  };
  </script>
  
  <style scoped>
  .productWrapper {
    display: flex;
    background-color: #f9f8f5;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 20px auto;
  }
  
  .wrapperLeft {
    flex: 1;
    padding-right: 20px;
  }
  
  .wrapperLeft img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  
  .wrapperRight {
    flex: 1;
    padding-left: 20px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 10px;
    font-size: 18px;
    color: #333;
  }
  
  strong {
    color: #a0522d;
  }
  
  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #d1cfcf;
    resize: none;
    font-family: Arial, sans-serif;
  }
  
  textarea:focus {
    outline: none;
    border-color: #a0522d;
  }
  
  @media (max-width: 600px) {
    .productWrapper {
      flex-direction: column;
    }
  
    .wrapperLeft,
    .wrapperRight {
      padding: 0;
    }
  
    .wrapperLeft {
      margin-bottom: 20px;
    }
  }
  </style>
  
  