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
          <form
            id="uploadForm"
            enctype="multipart/form-data"
            @submit.prevent="saveProduct"
          >
            <h3>Ändra Produkt</h3>
            <br />
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
              <button type="button" class="save-btn" @click="addProperty">
                Lägg till Egenskap
              </button>
              <ul>
                <li
                  v-for="(property, index) in editingProduct.properties"
                  :key="property.property_id"
                >
                  {{ property.name }}
                  <button type="button" @click="removeProperty(index)">
                    Remove
                  </button>
                </li>
              </ul>
            </fieldset>

            <fieldset class="fieldsetFlex">
              <legend>Bilder</legend>
              <div class="editingImageWrapper">
                <div class="form-group">
                  <label for="primaryImage">Första Bilden:</label>
                  <input
                    type="file"
                    id="primaryImage"
                    @change="onImageChangeEditing($event, 'primary')"
                    accept="image/*"
                  />
                  <img
                    class="editingImage"
                    :src="editingProduct.image_url_primary"
                    alt=""
                  />
                </div>

                <div class="form-group">
                  <label for="secondaryImage">Andra Bilden:</label>
                  <input
                    type="file"
                    id="secondaryImage"
                    @change="onImageChangeEditing($event, 'secondary')"
                    accept="image/*"
                  />
                  <img
                    class="editingImage"
                    :src="editingProduct.image_url_secondary"
                    alt=""
                  />
                </div>

                <div class="form-group">
                  <label for="thirdImage">Tredje Bilden:</label>
                  <input
                    type="file"
                    id="thirdImage"
                    @change="onImageChangeEditing($event, 'third')"
                    accept="image/*"
                  />
                  <img
                    class="editingImage"
                    :src="editingProduct.image_url_third"
                    alt=""
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
                >Kategori: {{ editingProduct.category.category_name }}</label
              >
              <select v-model="editingProduct.category.category_id">
                <option value="" disabled selected>Välj en kategori</option>
                <option
                  v-for="(category, index) in categoriesOnLoad"
                  :key="index"
                  :value="category.category_id"
                >
                  {{ category.category_name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="brandId"
                >Märke: {{ editingProduct.brand.brand_name }}</label
              >
              <select v-model="editingProduct.brand.brand_id">
                <option value="" disabled selected>Välj ett märke</option>
                <option
                  v-for="(brand, index) in brandsOnLoad"
                  :key="index"
                  :value="brand.brand_id"
                >
                  {{ brand.brand_name }}
                </option>
              </select>
            </div>

            <fieldset>
              <legend>Sizes</legend>
              <div
                v-for="(variant, index) in editingProduct.variants"
                :key="index"
                class="size-variant"
              >
                <input v-model="variant.size" type="text" placeholder="Size" />
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
                <button
                  type="button"
                  class="delete-btn"
                  @click="removeSize(index)"
                >
                  Ta Bort Storlek
                </button>
              </div>
              <button type="button" @click="addSize">Lägg Till Storlek</button>
            </fieldset>

            <div class="form-group">
              <label>Ska denna produkten vara på landningssidan?</label>
              <input
                type="radio"
                id="featuredYes"
                value="1"
                v-model="editingProduct.featured"
              />
              <label for="featuredYes">Ja</label>
              <input
                type="radio"
                id="featuredNo"
                value="0"
                v-model="editingProduct.featured"
              />
              <label for="featuredNo">Nej</label>
            </div>

            <div class="button-group">
              <button
                class="delete-btn"
                type="button"
                @click="deleteProduct(product.product_id)"
              >
                <font-awesome-icon :icon="['fas', 'trash']" /> Ta bort
              </button>
              <button
                type="button"
                class="cancel-btn"
                @click="cancelEdit(product)"
              >
                <font-awesome-icon :icon="['fas', 'times']" /> Avbryt
              </button>
              <button type="button" class="save-btn" @click="saveProduct">
                <font-awesome-icon :icon="['fas', 'save']" /> Spara
              </button>
            </div>
          </form>
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
      propertiesOnLoad: [],
      brandsOnLoad: "",
      categoriesOnLoad: "",
    };
  },
  created() {
    this.fetchProductProperties();
    this.fetchCategories();
    this.fetchBrands();
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
    async fetchBrands() {
      try {
        const response = await axiosInstance.get(`/brands`);
        this.brandsOnLoad = response.data.map((brandsOnLoad) => ({
          ...brandsOnLoad,
        }));
      } catch (error) {
        console.error(
          "Error fetching Brands:",
          error.response || error.message
        );
        Swal.fire(
          "Fel",
          "Fel vid hämtning av märken: Misslyckades med att hämta märken. Försök igen senare",
          "error"
        );
      }
    },
    async fetchCategories() {
      try {
        const response = await axiosInstance.get(`/categories`);
        this.categoriesOnLoad = response.data.map((categoriesOnLoad) => ({
          ...categoriesOnLoad,
        }));
      } catch (error) {
        console.error(
          "Error fetching Categories:",
          error.response || error.message
        );
        Swal.fire(
          "Fel",
          "Fel vid hämtning av kategorier: Misslyckades med att hämta kategorier. Försök igen senare",
          "error"
        );
      }
    },
    async deleteProduct(productId) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Är du säker på att du vill ta bort denna kursen? Du kan inte ändra dig sen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ja, ta bort den!",
        cancelButtonText: "Avbryt",
      });
      if (!result.isConfirmed) return;
      try {
        await axiosInstance.delete(`admin/products/${productId}`);
        this.$emit("product-deleted", productId);
        await Swal.fire("Borttagen!", "Produkt borttagen", "success");
      } catch (error) {
        console.error("Error deleting product:", error);
        await Swal.fire(
          "Fel",
          "Kunde inte ta bort produkten. Försök igen senare.",
          "error"
        );
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
        if (Array.isArray(this.editingProduct.properties)) {
          const property = this.propertiesOnLoad.find(
            (p) => p.property_id === this.selectedProperty
          );
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
          this.editingProduct.properties = [];
          const property = this.propertiesOnLoad.find(
            (p) => p.property_id === this.selectedProperty
          );
          this.editingProduct.properties.push(property);
        }
        this.selectedProperty = "";
      }
    },
    onImageChangeEditing(event, imageType) {
      const file = event.target.files[0];

      if (imageType === "primary") {
        this.editingProduct.primaryImageFile = file;
      } else if (imageType === "secondary") {
        this.editingProduct.secondaryImageFile = file;
      } else if (imageType === "third") {
        this.editingProduct.thirdImageFile = file;
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
      const formData = new FormData();
      formData.append("product_name", this.editingProduct.product_name);
      formData.append("description", this.editingProduct.description);
      formData.append("category_id", this.editingProduct.category.category_id);
      formData.append("product_id", this.editingProduct.product_id);
      formData.append("featured", this.editingProduct.featured);
      formData.append("usage_products", this.editingProduct.usage_products);
      formData.append("ingredients", this.editingProduct.ingredients);
      formData.append("brand_id", this.editingProduct.brand.brand_id);
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
        .put(`admin/products/${this.editingProduct.product_id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          Swal.fire(
            "Produkt sparad!",
            `Produkten "${this.editProduct.productName}" har ändrats.`,
            "success"
          );
          this.cancelEdit();
        })
        .catch((error) => {
          console.error("Error saving product:", error);
          const errorMessages = error.response.data.errors
            .map((error) => error.msg)
            .join("<br>");

          Swal.fire(
            "Error",
            `Märke kunde inte läggas till. Kolla vad du har skrivit in och försök igen! <br> ${errorMessages}`,
            "error"
          );
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
  margin-top: 20px;
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
  font-size: 16px;
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
  box-shadow: 4px 8px 12px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 10px;
  background-color: #fff;
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

.form-group {
  margin-bottom: 15px;
}

.fieldsetFlex {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.productListWrapper {
  width: 100%;
}

.fieldset {
  margin: 20px 0;
  border: none;
  padding: 0;
}

.editingImage {
  width: 75px;
  height: 75px;
  padding: 5px;
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
  border: none;
  border-radius: 5px;
  margin-top: 5px;
  color: black;
  background-color: #dddddd;
}

.editingImageWrapper {
  display: flex;
  flex-flow: wrap;
  flex-direction: column;
  width: 100%;
}

button {
  color: black;
}

button:hover {
  color: white;
}

input {
  color: black;
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

@media (max-width: 767px) {
  input,
  select,
  textarea {
    font-size: 16px;
  }
  .product-list {
    padding: 10px;
  }

  .product-card {
    padding: 10px;
    margin-bottom: 10px;
  }

  .product-info {
    align-items: center;
  }

  .image-container-wrapper {
    flex-wrap: wrap;
  }

  .product-image-container {
    width: 50%;
    margin-bottom: 10px;
  }

  .product-image {
    max-width: 80px;
  }

  .action-buttons {
    justify-content: center;
  }

  .button-group {
    flex-wrap: wrap;
    justify-content: center;
  }

  .form-group {
    margin-bottom: 10px;
  }

  input[type="text"],
  input[type="number"],
  textarea,
  select {
    padding: 6px;
  }

  button {
    padding: 8px 12px;
  }
}
</style>
