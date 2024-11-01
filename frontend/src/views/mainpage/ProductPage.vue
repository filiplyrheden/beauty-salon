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
        <div class="infoWrapper">
          <div class="productStars">
            <h2 class="productBrand">{{ product.category_name }}</h2>
          </div>
          <h1 class="productName">{{ product.product_name }}</h1>
          <!-- <p class="productSmallDescription">Hydrate and brighten damaged skin</p> -->
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
        </div>

        <div class="addProductWrapper">
          <div class="sizeAndQuantity">
            <div class="size">
              <p v-if="chosenSize.name">{{ chosenSize.name }} (Vald)</p>
              <p>Välj Storlek</p>
              <button @click="toggleSizesPopup">
                <font-awesome-icon :icon="isSizesPopupVisible ? 'chevron-up' : 'chevron-down'" />
              </button>
            </div>
            <div class="cartAddRemoveQuantity">
                <button class="incrementDecrement" @click="decrementProduct()"><img src="../../assets/minus.svg" alt=""></button>
                <p class="incrementDecrementText">{{ quantity }}</p>
                <button class="incrementDecrement" @click="incrementProduct()"><img src="../../assets/plus.svg" alt=""></button>
            </div>
          </div>
  
          <div class="selectSizeWrapper" v-if="isSizesPopupVisible">
            <div class="infoHolder" 
                v-for="(size, index) in product.variants" 
                :key="index" 
                @click="() => { changeSize(size); toggleSizesPopup(); }">
              <label class="sizeSelection">{{ size.sizeName }}</label>
              <label class="sizeSelection sizeSelectionPrice">{{ size.price }} kr</label>
            </div>
          </div>
          <div :class="{ checkoutButtonDisabled: !chosenSize.name }" class="checkoutButton">
            <button @click="addItemToCart(product)">LÄGG I VARUKORG</button>
          </div>
        </div>
        <div class="AnvandningIngredienserWrapper">
          <div class="anvandningWrapper" @click="toggleAnvandningPopup()">
            <label>
              <p>Användning</p>
            </label>
            <font-awesome-icon :icon="isAnvandningPopupVisible ? 'chevron-up' : 'chevron-down'" />
          </div>
          <div v-if="isAnvandningPopupVisible" class="anvandning">
            <p>Du använder den såhäe blablalblallalal</p> <!-- tryck in data här senare -->
          </div>
          <div class="ingredientsWrapper" @click="toggleIngredienserPopup()">
            <label>
              <p>Ingredienser</p>
            </label>
            <font-awesome-icon :icon="isIngredienserPopupVisible ? 'chevron-up' : 'chevron-down'" />
          </div>
          <div v-if="isIngredienserPopupVisible" class="ingredients">
            <p>ingredients blablablabla</p> <!-- tryck in data här senare -->
          </div>
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
      isSizesPopupVisible: false,
      isAnvandningPopupVisible: false,
      isIngredienserPopupVisible: false,
      chosenSize: { name: "", price: 0, size_id: null },
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
    changeSize(size) {
      this.chosenSize = { 
        name: size.sizeName, 
        price: size.price, 
        size_id: size.size_id
      };
      console.log(this.chosenSize);
    },
    incrementProduct() {
    if (this.quantity < 99) this.quantity++;
    },
    addItemToCart(product) {
      console.log(" product that is going to store.js: ");
      console.log(product);
      this.$store.commit("addToCart", { 
        product, 
        size_id: this.chosenSize.size_id,
        quantityFromProductPage: this.quantity,
      });
    },
    decrementProduct() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    toggleSizesPopup() {
      this.isSizesPopupVisible = !this.isSizesPopupVisible;
      console.log(this.isSizesPopupVisible);
    },
    toggleAnvandningPopup() {
      this.isAnvandningPopupVisible = !this.isAnvandningPopupVisible;
      console.log(this.isAnvandningPopupVisible);
    },
    toggleIngredienserPopup() {
      this.isIngredienserPopupVisible = !this.isIngredienserPopupVisible;
      console.log(this.isIngredienserPopupVisible);
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
  gap: 72px;
  width: 40%;
}
.checkoutButton button{
  font-family: "Playfair Display", serif;
  background-color: #202020;
  width: 100%;
  border: 2px solid black;
  color: #FDFDFD;
  padding: 15px;
  cursor: pointer;
}
.checkoutButtonDisabled button {
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
.checkoutButton button:hover{
background-color: rgba(32, 32, 32, 0.8);
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
.infoWrapper{
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.ingredientsWrapper{
display: flex;
justify-content: space-between;
}
.anvandning{
  padding: 15px;
}
.ingredients{
  padding: 15px;
}
.anvandningWrapper{
display: flex;
justify-content: space-between;
}
.addProductWrapper{
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.AnvandningIngredienserWrapper{
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  width: 50%;
  align-items: center;
  justify-content:space-between;
  display: flex;
  gap: 10px;
}
.size button{
  all: unset;
  cursor: pointer;
}
.infoHolder{
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 15px;
  padding: 8px;
  width: 50%;
}
.infoHolder:hover{
  background-color: rgba(32, 32, 32, 0.8);
  color: white;
  cursor: pointer;
}
.sizeSelectionPrice{
  margin-left: auto;
}
.selectSizeWrapper{
  display: flex;
  flex-direction: column;
  gap: 5px;
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
