<template>
  <transition name="slide">
    <div class="cart">
      <div class="cart-header">
        <button class="cartCloseButton" @click="hideCart">
          <img src="../assets/exit.svg" alt="" />
        </button>
        <h1>DIN KUNDKORG</h1>
      </div>
      <div v-if="cartItems.length === 0">
        Inga varor i din korg, Gå och shoppa! <a href="/shop">här</a>
      </div>
      <div class="items">
        <div v-for="item in cartItems" :key="item.id" class="item">
          <!-- TODO: set the image to :src="item.image_url" using a testing image to design page-->
          <button
            @click="removeItem(item.product_id, item.size_id)"
            class="cartExitButton"
          >
            <img class="trashIcon" src="../assets/trashcan.svg" alt="" />
          </button>
          <img src="../assets/noImage.png" alt="" />
          <div class="item-info">
            <div class="item-header">
              <p>{{ item.product_name }}</p>
              <div class="info">
                <p>( {{ item.size }} )</p>
                <p></p>
                <p>({{ item.price }} kr/st )</p>
              </div>
            </div>
            <div class="product-footer">
              <div class="buttons">
                <button
                  class="incrementDecrement"
                  @click="
                    handleDecrementOrRemove(item.product_id, item.size_id)
                  "
                >
                  -
                </button>
                <p class="incrementDecrementText">{{ item.quantity }}</p>
                <button
                  class="incrementDecrement"
                  @click="incrementItemInCart(item.product_id, item.size_id)"
                >
                  +
                </button>
              </div>
              <p class="total-item">
                {{ (item.price * item.quantity).toFixed(2) }} kr
              </p>
            </div>
          </div>
          <!-- Button for removing or decrementing item -->
        </div>
      </div>
      <div class="cart-summary">
        <h3>SUMMA: {{ totalPrice.toFixed(2) }} kr</h3>
        <button @click="handleCheckout">CHECKA UT</button>
        <ul>
          <li><img :src="visa" alt="" /></li>
          <li><img :src="mastercard" alt="" /></li>
        </ul>
        <div>Priser och fraktavgift bekräftas inte förrän i kassan.</div>
      </div>
    </div>
  </transition>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";
import visa from "../assets/payment/visa.svg";
import mastercard from "../assets/payment/mastercard.svg";
import { mapState, mapMutations } from "vuex";

export default {
  name: "ShoppingCart",
  data() {
    return {
      visa,
      mastercard,
    };
  },
  computed: {
    ...mapState(["isCartVisible"]),

    cartItems() {
      return this.$store.getters.cartItems;
    },
    totalPrice() {
      return this.$store.getters.cartTotalPrice;
    },
  },
  methods: {
    ...mapMutations({
      hideCart: "hideCart",
    }),
    closeCart() {
      this.hideCart();
    },
    addItemToCart(product) {
      this.$store.commit("addToCart", product);
    },
    incrementItemInCart(productId, sizeId) {
      this.$store.commit("incrementItemInCart", {
        productId: productId,
        sizeId: sizeId,
      });
    },
    decrementItem(productId, sizeId) {
      this.$store.commit("decrementItemInCart", {
        productId: productId,
        sizeId: sizeId,
      }); // Commit the Vuex mutation
    },
    removeItem(productId, sizeId) {
      this.$store.commit("removeFromCart", {
        productId: productId,
        sizeId: sizeId,
      });
    },
    clearCart() {
      this.$store.commit("clearCart");
    },
    // Method to handle both decrement and remove logic
    handleDecrementOrRemove(productId, sizeId) {
      const item = this.$store.state.cart.find(
        (item) => item.product_id === productId && item.size_id === sizeId
      );
      if (item.quantity === 1) {
        this.removeItem(productId, sizeId); // Remove the item if quantity is 1
      } else {
        this.decrementItem(productId, sizeId); // Otherwise, decrement the quantity
      }
    },
    async handleCheckout() {
      try {
        console.log(this.$store.state.userId);
        const response = await axiosInstance.post("/create-checkout-session", {
          dummyItems: this.$store.state.cart.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            size_id: item.size_id,
          })),
          user_id: this.$store.state.userId,
        });

        // Manually handle the redirect from the 303 status
        const { url } = response.data;
        window.location.href = url;
      } catch (error) {
        if (error.response && error.response.status === 303) {
          // If 303, redirect manually to the URL in the response
          const redirectUrl = error.response.data.url;
          window.location.href = redirectUrl;
        } else {
          console.error("Error creating checkout session:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.cart {
  border-left: 1px solid black;
  display: flex;
  flex-direction: column;
  padding: 32px;
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 35%;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}
.cartCloseButton {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background-color: transparent;
}
.cart-header {
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.items {
  padding: 32px 0px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 65%;
  overflow: scroll;
}
.total-item {
  font-weight: 600;
}
.cart-summary {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 25%;
}
.cart-summary h3 {
  align-self: flex-end;
  margin-bottom: 16px;
}

.cart-summary button {
  width: 100%;
  padding: 8px 16px;
  font-family: "Playfair Display", serif !important;
  letter-spacing: 5%;
  font-weight: 600;
  background: black;
  color: white;
  border: 1px solid black;
  font-size: 18px;
  cursor: pointer;
}
.cart-summary button:hover {
  background: white;
  color: black;
}

.item {
  display: flex;
  height: 100px;
  width: 100%;
  gap: 16px;
}
.item img {
  width: 75px;
  height: 100%;
  object-fit: cover;
}
.info {
  display: flex;
  justify-content: space-between;
  font-weight: 400;
}
.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  flex-direction: column;
}
.item-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: space-between;
}
.buttons {
  display: flex;
  height: 28px;
  width: 72px;
  align-items: center;
  border: 2px solid black;
}
.incrementDecrement {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 20px;
  -o-object-fit: cover;
  object-fit: cover;
  align-content: center;
  border: none;
  cursor: pointer;
}
.incrementDecrementText {
  width: 24px;
  text-align: center;
  font-size: 18px;
}

h1 {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-weight: 600;
  font-size: 32px;
}
.trashIcon {
  height: 24px !important;
  width: 24px !important;
  object-fit: none !important;
  cursor: pointer;
}
.cartExitButton {
  all: unset;
  border: none;
}
ul {
  display: flex;
  gap: 16px;
  list-style: none;
}

.slide-enter-active,
.slide-leave-active {
  transition: width 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  width: 0;
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  width: 35%;
  opacity: 1;
}
</style>
