<template>
  <div>
    <div class="productWrapper">
      <div class="productImages">
        <div class="otherImages">
          <img :src="product.image_url_secondary" alt="Secondary Image" @click="swapImage('secondary')">
          <img :src="product.image_url_third" alt="Third Image" @click="swapImage('third')">
        </div>
        <div class="primaryImage">
          <img :src="product.image_url_primary" alt="Primary Image">
        </div>
      </div>
      <div class="productInfo">
        <div class="productStars">
          <h2 class="productBrand">{{ product.category_name }}</h2>
        </div>
        <h1 class="productName">{{ product.product_name }}</h1>
        <!-- <p class="productSmallDescription">Hydrate and brighten damaged skin</p> -->
        <p class="productPrice">{{ product.price }} kr</p>
        <p class="productDescription">{{ product.description }}</p>
        
        <div class="whichCreamWrapper">
          <p class="hudtyp">Hudtyp</p>
          <div class="hudtypWrapper">
            <label class="creamLabel">Pigmented</label>
            <label class="creamLabel">Aging</label>
            <label class="creamLabel">Dry</label>
          </div>
        </div>
        <div class="whichEffect">
          <p class="effekt">Effekt</p>
          <div class="effektWrapper">
            <label class="effectLabel">Exfoliating</label>
            <label class="effectLabel">Brightening</label>
            <label class="effectLabel">Hydrating</label>
            <label class="effectLabel">Non-foaming</label>
          </div>
          
        </div>
        
        <div class="sizeAndQuantity">
          <div class="size">
            <p>Välj Storlek</p> <!-- inte fixat än -->
            <p>^</p>
          </div>
          <div class="cartAddRemoveQuantity">
              <button class="incrementDecrement" @click="decrementProduct()"><img src="../../assets/minus.svg" alt=""></button>
              <p class="incrementDecrementText">{{ quantity }}</p>
              <button class="incrementDecrement" @click="incrementProduct()"><img src="../../assets/plus.svg" alt=""></button>
          </div>
        </div>
        
        <div class="checkoutButton">
          <button @click="addItemToCart(product)">LÄGG I VARUKORG</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/services/axiosConfig';

export default {
  name: 'ProductView',
  data() {
    return {
      quantity: 1, // Default quantity
      product: {},
    };
  },
  created() {
    const product_Id = this.$route.params.id;
    if (product_Id) {
      this.getProductById(product_Id);
    }
  },
  methods: {
    async getProductById(product_id) {
      try {
        const response = await axiosInstance.get(`/product/${product_id}`);
        this.product = response.data.result;
        console.log("produkt: ");
        console.log(response.data.result);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    },
    incrementProduct() {
    this.quantity++;
  },
  addItemToCart(product) {
      this.$store.commit("addToCart", product);
    },
  decrementProduct() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  },
  swapImage(type) {
      // Temporary store the primary image
      const tempPrimaryImage = this.product.image_url_primary;
      
      // Swap images based on clicked type
      if (type === 'secondary') {
        this.product.image_url_primary = this.product.image_url_secondary;
        this.product.image_url_secondary = tempPrimaryImage;
      } else if (type === 'third') {
        this.product.image_url_primary = this.product.image_url_third;
        this.product.image_url_third = tempPrimaryImage;
      }
    },
  },
};
</script>

<style scoped>
.cartAddRemoveQuantity button,.cartAddRemoveQuantity p{
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  width: 24px;
  height: 24px;
}
.incrementDecrement:hover{
  background-color: rgb(179, 179, 179);
  opacity: 0.75;
  cursor: pointer;
}
.incrementDecrement img{
  align-self: center;
}
.productWrapper{
  padding-left: 72px;
  padding-right: 72px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content:center;
  gap: 30px;
}
.productImages{
  display: flex;
  gap: 10px;
}
.otherImages{
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  gap: 30px;
}
.otherImages img{
  width: 73px;
  height: 101px;
  object-fit: cover;
  cursor: pointer;
}

.otherImages img:hover {
  box-shadow: 3px 6px 10px rgba(0, 0, 0, 0.25);
  transform: translateX(7px);
  transform: translateY(-3px);
  transition: all 0.3s ease;
}
.primaryImage img{
  width: 459px;
  height: 630px;
  object-fit: cover;
}
.productInfo{
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 40%;
}
.checkoutButton button{
  font-family: "Playfair Display", serif;
  width: 100%;
  border: 2px solid black;
}
.productStars{
  display: flex;
  justify-content: space-between;
}
.productBrand{
  color: rgba(32, 32, 32, 0.5);
  font-family: "Playfair Display", serif;
}
.productName{
  font-family: "Playfair Display", serif;
}
.hudtyp{
  padding-bottom: 5px;
}
.effekt{
  padding-bottom: 5px;
}
.hudtypWrapper{
  display: flex;
  gap: 15px;
}
.effektWrapper{
  display: flex;
  gap: 15px;
}
.creamLabel{
background-color: rgba(32, 32, 32, 0.25);
padding: 10px;
}
.effectLabel{
background-color: rgba(32, 32, 32, 0.25);
padding: 10px;
}
.size{
  display: flex;
  gap: 10px;
}
.cartAddRemoveQuantity{
  align-self: flex-end;
  display: flex;
  margin-left: auto;
  height: 28px;
  width: 72px;
  align-items: center;
  border: 2px solid black;
}
.sizeAndQuantity{
  display: flex;
}
</style>
