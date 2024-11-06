<template>
  <div class="product-list">
    <h2>Produkt Lista:</h2>
    <ul class="productListWrapper">
      <li
        v-for="product in items"
        :key="product.product_id"
        class="product-card"
      >
        <div class="product-info">
          <div class="image-container-wrapper">
            <div
              class="product-image-container"
              v-for="(image, index) in [
                product.image_url_primary,
                product.image_url_secondary,
                product.image_url_third,
              ]"
              :key="index"
            >
              <img
                :src="getImageUrl(image)"
                :alt="product.product_name"
                class="product-image"
              />
            </div>
          </div>
          <p><strong>Namn:</strong> {{ product.product_name }}</p>
          <p><strong>ID:</strong> {{ product.product_id }}</p>
          <p><strong>Beskrivning:</strong> {{ product.description }}</p>
          <p><strong>Kategori:</strong> {{ product.category.category_name }}</p>
          <p>
            <strong>Märke:</strong>
            {{ product.brand.brand_name }}
          </p>

          <p>
            <strong>Skapad den:</strong> {{ formatDate(product.created_at) }}
          </p>
          <div class="product-variants">
            <p><strong>Storlekar:</strong></p>
            <ul v-if="product.variants.length">
              <li v-for="(variant, index) in product.variants" :key="index">
                <strong>{{ variant.size }}</strong> - Pris:
                {{ variant.price }} SEK, Lager: {{ variant.stock_quantity }}
              </li>
            </ul>
            <p v-else>Inga storlekar tillgängliga.</p>
          </div>
          <div class="product-properties">
            <p><strong>Egenskaper:</strong></p>
            <ul v-if="product.properties.length">
              <li v-for="(property, index) in product.properties" :key="index">
                {{ property.name }}
              </li>
            </ul>
            <p v-else>Inga egenskaper tillgängliga.</p>
          </div>
          <p>
            <strong>Visas på förstasidan:</strong>
            {{ product.featured ? "Ja" : "Nej" }}
          </p>
        </div>

        <div class="action-buttons">
          <button class="delete-btn" @click="deleteProduct(product.product_id)">
            <font-awesome-icon :icon="['fas', 'trash']" /> Ta Bort
          </button>
          <button class="edit-btn" @click="editProduct(product)">
            <font-awesome-icon :icon="['fas', 'edit']" /> Ändra
          </button>
        </div>

        <div
          v-if="
            editingProduct && editingProduct.product_id === product.product_id
          "
          class="edit-form"
        >
          <h3>Ändra Produkt</h3>
          <h4>{{ product }}</h4>
          <br />
          <h4>{{ editingProduct }}</h4>
          <div class="form-group">
            <label for="productName">Prouktnamn</label>
            <input
              class="productNameInput"
              id="productName"
              v-model="editingProduct.product_name"
              placeholder="Product Name"
            />
          </div>
          <div class="form-group">
            <label for="productDescription">Beskrivning</label>
            <textarea
              id="productDescription"
              v-model="editingProduct.description"
              placeholder="Description"
            ></textarea>
          </div>

          <fieldset class="fieldsetFlex">
            <legend>Egenskaper</legend>
            <label for="property">Välj Egenskap:</label>
            <select id="property" v-model="selectedProperty">
              <option
                v-for="property in propertiesOnLoad"
                :key="property.property_id"
                :value="property.property_id"
              >
                {{ property.name }}
              </option>
            </select>
            <button class="save-btn" @click="addProperty">
              Lägg till Egenskap
            </button>
            <ul>
              <li
                v-for="(property, index) in editingProduct.properties"
                :key="property.property_id"
              >
                {{ property.name }}
                <button @click="removeProperty(index)">Remove</button>
              </li>
            </ul>
          </fieldset>

          <fieldset>
            <legend>Bilder</legend>
            <div class="editingImageWrapper">
              <div
                class="form-group"
                v-for="(imageType, index) in ['primary', 'secondary', 'third']"
                :key="index"
              >
                <label :for="`${imageType}Image`">
                  {{ imageType.charAt(0).toUpperCase() + imageType.slice(1) }}
                  Image:</label
                >
                <div
                  v-if="editingProduct[`image_url_${imageType}`]"
                  class="currentImagePreview"
                >
                  <img
                    :src="getImageUrl(editingProduct[`image_url_${imageType}`])"
                    alt="Image Preview"
                    class="product-image"
                  />
                </div>
                <input
                  type="file"
                  :id="`${imageType}Image`"
                  @change="onImageChange($event, imageType)"
                  accept="image/*"
                />
              </div>
            </div>
          </fieldset>

          <div class="form-group">
            <label for="usageProducts">Användningsinstruktioner</label>
            <textarea
              id="usageProducts"
              v-model="editingProduct.usage_products"
              placeholder="Enter usage instructions"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="categoryId"
              >Kategori ID ÄNDRA DENNA(Current:
              {{ editingProduct.category.category_name }})</label
            >
            <input
              type="number"
              id="categoryId"
              v-model="editingProduct.category.category_id"
              required
              placeholder="Enter category ID"
            />
          </div>

          <fieldset>
            <legend>Sizes</legend>
            <div
              v-for="(variant, index) in editingProduct.variants"
              :key="index"
              class="size-variant"
            >
              <input v-model="variant.size" placeholder="Size" />
              <input
                v-model.number="variant.price"
                type="number"
                placeholder="Price"
              />
              <input
                v-model.number="variant.stock_quantity"
                type="number"
                placeholder="Stock Quantity"
              />
              <button class="delete-btn" @click="removeSize(index)">
                Ta Bort Storlek
              </button>
            </div>
            <button @click.prevent="addSize">Lägg Till Storlek</button>
          </fieldset>

          <div class="form-group">
            <label>Ska denna produkten vara på landningssidan?</label>
            <input
              type="radio"
              id="featuredYes"
              value="true"
              v-model="editingProduct.featured"
            />
            <label for="featuredYes">Ja</label>
            <input
              type="radio"
              id="featuredNo"
              value="false"
              v-model="editingProduct.featured"
            />
            <label for="featuredNo">Nej</label>
          </div>

          <div class="button-group">
            <button
              class="delete-btn"
              @click="deleteProduct(product.product_id)"
            >
              <font-awesome-icon :icon="['fas', 'trash']" /> Ta bort
            </button>
            <button class="cancel-btn" @click="cancelEdit(product)">
              <font-awesome-icon :icon="['fas', 'times']" /> Avbryt
            </button>
            <button class="save-btn" @click="saveProduct(product)">
              <font-awesome-icon :icon="['fas', 'save']" /> Spara
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axiosInstance from "@/services/axiosConfig";

export default {
  props: { items: Array },
  data() {
    return {
      editingProduct: null,
      selectedProperty: "",
      propertiesOnLoad: [], // Load properties as needed
    };
  },
  created() {
    this.fetchProductProperties();
  },
  methods: {
    getImageUrl(image) {
      return image;
    },
    async fetchProductProperties() {
      try {
        const response = await axiosInstance.get(`/productproperties`);
        this.propertiesOnLoad = response.data.map((propertiesOnLoad) => ({
          ...propertiesOnLoad,
        }));
      } catch (error) {
        console.error(
          "Error fetching Proeduct Properties:",
          error.response || error.message
        );
        Swal.fire(
          "Fel",
          "Fel vid hämtning av Event: Misslyckades med att hämta Event. Försök igen senare",
          "error"
        );
      }
    },
    deleteProduct(productId) {
      axiosInstance.delete(`admin/products/${productId}`).then(() => {
        Swal.fire("Product deleted");
        this.$emit("product-deleted", productId);
      });
    },
    onImageChange(event, imageType) {
      const file = event.target.files[0];

      if (imageType === "primary") {
        this.primaryImageFile = file;
      } else if (imageType === "secondary") {
        this.secondaryImageFile = file;
      } else if (imageType === "third") {
        this.thirdImageFile = file;
      }
    },
    editProduct(product) {
      this.editingProduct = JSON.parse(JSON.stringify(product));
    },
    formatDate(utcDate) {
      const date = new Date(utcDate);
      const options = {
        timeZone: "CET",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      return date.toLocaleString("en-GB", options);
    },
    addProperty() {
      if (this.selectedProperty) {
        // Check if properties is an array; if not, initialize it as an array
        if (Array.isArray(this.editingProduct.properties)) {
          const property = this.propertiesOnLoad.find(
            (p) => p.property_id === this.selectedProperty
          );
          // Check if the property is already in the array
          if (
            !this.editingProduct.properties.find(
              (p) => p.property_id === property.property_id
            )
          ) {
            this.editingProduct.properties.push(property);
          } else {
            Swal.fire("Property already added");
          }
        } else {
          // Initialize properties as an array and add the selected property
          this.editingProduct.properties = [];
          const property = this.propertiesOnLoad.find(
            (p) => p.property_id === this.selectedProperty
          );
          this.editingProduct.properties.push(property);
        }
        // Reset selectedProperty after adding
        this.selectedProperty = "";
      }
    },
    removeProperty(index) {
      this.editingProduct.properties.splice(index, 1);
    },
    addSize() {
      this.editingProduct.variants.push({
        size: "",
        price: 0,
        stock_quantity: 0,
      });
    },
    removeSize(index) {
      this.editingProduct.variants.splice(index, 1);
    },
    saveProduct() {
      console.log("Saving product:", this.editingProduct);
      const formData = new FormData();
      formData.append("product_name", this.editingProduct.product_name);
      formData.append("description", this.editingProduct.description);
      formData.append("category_id", this.editingProduct.category.category_id);
      formData.append("product_id", this.editingProduct.product_id);
      formData.append("featured", this.editingProduct.featured); // Ensure 'featured' is part of editingProduct
      formData.append("usage_products", this.editingProduct.usage_products); // Usage instructions
      formData.append("ingredients", this.editingProduct.ingredients); // Ensure 'ingredients' is part of editingProduct

      if (this.editingProduct.primaryImageFile)
        formData.append("primaryImage", this.editingProduct.primaryImageFile);
      if (this.editingProduct.secondaryImageFile)
        formData.append(
          "secondaryImage",
          this.editingProduct.secondaryImageFile
        );
      if (this.editingProduct.thirdImageFile)
        formData.append("thirdImage", this.editingProduct.thirdImageFile);

      this.editingProduct.variants.forEach((variant, i) => {
        formData.append(`variants[${i}][size]`, variant.size);
        formData.append(`variants[${i}][price]`, variant.price);
        formData.append(
          `variants[${i}][stock_quantity]`,
          variant.stock_quantity
        );
      });

      if (Array.isArray(this.editingProduct.properties)) {
        this.editingProduct.properties.forEach((property, i) => {
          formData.append(`properties[${i}][name]`, property.name);
          formData.append(
            `properties[${i}][property_id]`,
            property.property_id
          );
        });
      } else {
        console.warn(
          "Properties is not an array:",
          this.editingProduct.properties
        );
      }

      axiosInstance
        .put(`admin/products/${this.editingProduct.product_id}`, formData)
        .then(() => {
          Swal.fire("Product saved successfully");
          this.cancelEdit();
        });
    },

    cancelEdit() {
      this.editingProduct = null;
    },
  },
};
</script>

<style scoped>
li {
  list-style: none;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 10px;
}
.product-list {
  max-width: 900px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  margin: 0 auto;
  padding: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
fieldset {
  border: none;
}

.productNameInput {
  font-size: 20px;
}

.action-buttons {
  padding-top: 15px;
  display: flex;
  justify-content: start;
  gap: 10px;
}

.button-group {
  padding-top: 15px;
  display: flex;
  justify-content: start;
  gap: 10px;
}

.product-image-container {
  display: flex;
  justify-content: center;
  margin: 10px 0;
  box-shadow: 4px 8px 12px rgba(0, 0, 0, 0.2); /* Add drop shadow */
  border-radius: 8px; /* Optional: round the corners */
  padding: 10px; /* Optional: add some padding for better spacing */
  background-color: #fff; /* Optional: ensure background is white for contrast */
}

.size-variant {
  display: flex;
  gap: 5px;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}

.product-image {
  max-width: 100px;
  height: auto;
  border-radius: 8px;
  margin: 0 5px;
}

.image-container-wrapper {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
  width: 100%;
}

.edit-form {
  margin-top: 20px;
  padding: 20px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.productListWrapper {
  width: 600px;
}

.form-group {
  margin-bottom: 15px;
}

.fieldsetFlex {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fieldset {
  margin: 20px 0;
  border: none; /* Remove border from fieldset */
  padding: 0; /* Optional: remove padding */
}

legend {
  margin-bottom: 10px;
  font-weight: bold;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"],
input[type="number"],
textarea,
select {
  width: 100%;
  padding: 8px;
  border: none; /* Remove border from input fields */
  border-radius: 5px;
  margin-top: 5px;
  background-color: #dddddd; /* Optional: background color for inputs */
}

.editingImageWrapper {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

textarea {
  height: 100px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #f0f0f0;
}

.delete-btn {
  background-color: #ff4d4d;
  color: white;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.save-btn {
  background-color: #28a745;
  color: white;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}
</style>
