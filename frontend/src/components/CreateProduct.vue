<template>
  <div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <div class="header">
      <button>
        <router-link to="/admin" class="back"
          ><font-awesome-icon icon="chevron-left" /> Tillbaka</router-link
        >
      </button>
      <h2>Add New Product</h2>
    </div>
    <div class="create-product">
      <form
        id="uploadForm"
        @submit.prevent="saveProduct"
        enctype="multipart/form-data"
      >
        <div class="form-group">
          <label for="productName">Produktnamn</label>
          <input
            type="text"
            id="productName"
            v-model="productName"
            required
            placeholder="Skriv Produktnamn"
          />
        </div>

        <div class="form-group">
          <label for="description">Beskrivning</label>
          <textarea
            id="description"
            v-model="description"
            required
            placeholder="Skriv Produktbeskrivning"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="categoryId">Kategori</label>
          <div class="custom-select-wrapper">
            <select v-model="categoryId">
              <option value="" disabled selected>Välj en kategori</option>
              <option
                v-for="(category, index) in categoriesOnLoad"
                :key="index"
                :value="category.category_id"
              >
                {{ category.category_name }}
              </option>
            </select>
            <font-awesome-icon class="select-chevron" icon="chevron-down" />
          </div>
        </div>

        <div class="form-group">
          <label for="brand">Märke</label>
          <div class="custom-select-wrapper">
            <select v-model="brand">
              <option value="" disabled selected>Välj ett märke</option>
              <option
                v-for="(brand, index) in brandsOnLoad"
                :key="index"
                :value="brand.brand_id"
              >
                {{ brand.brand_name }}
              </option>
            </select>
            <font-awesome-icon class="select-chevron" icon="chevron-down" />
          </div>
        </div>

        <div class="form-group-sizes">
          <div class="size-header">
            <label for="sizes">Storlekar och Priser</label>

            <button class="addSizes" @click.prevent="addSize">
              Lägg Till Storlek
            </button>
          </div>

          <div class="size-entries">
            <div v-for="(size, index) in sizes" :key="index" class="size-entry">
              <input
                v-model="size.size"
                type="text"
                placeholder="Storlek (Tex, 50 ml)"
                required
              />
              <input
                v-model.number="size.price"
                type="number"
                step="0.01"
                placeholder="Pris (SEK)"
                required
              />
              <input
                v-model.number="size.stock_quantity"
                type="number"
                placeholder="Kvantitet (10, 20, 30)"
                required
              />
              <div class="sizesButtonWrapper">
                <button v-if="index !== 0" @click.prevent="removeSize(index)">
                  Ta Bort Denna Storleken
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="usageProducts">Användarinstruktioner</label>
          <textarea
            id="usageProducts"
            v-model="usageProducts"
            placeholder="Användarinstruktioner"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="ingredients">Ingredienser</label>
          <textarea
            id="ingredients"
            v-model="ingredients"
            required
            placeholder="Skriv in alla ingredienser separerade med kommatecken (t.ex. Vatten, Glycerin, Doft)."
          ></textarea>
        </div>

        <div class="form-group">
          <label for="primaryImage">Första Bilden:</label>
          <input
            type="file"
            id="primaryImage"
            @change="onImageChange($event, 'primary')"
            accept="image/*"
          />
        </div>

        <div class="form-group">
          <label for="secondaryImage">Andra Bilden:</label>
          <input
            type="file"
            id="secondaryImage"
            @change="onImageChange($event, 'secondary')"
            accept="image/*"
          />
        </div>

        <div class="form-group">
          <label for="thirdImage">Tredje Bilden:</label>
          <input
            type="file"
            id="thirdImage"
            @change="onImageChange($event, 'third')"
            accept="image/*"
          />
        </div>

        <div class="form-group-properties">
          <label for="property">Egenskaper</label>
          <div class="selectPropertyWrapper">
            <div class="custom-select-wrapper">
              <select v-model="selectedProperty">
                <option value="" disabled selected>Välj en egenskap</option>
                <option
                  v-for="(property, index) in propertiesOnLoad"
                  :key="index"
                  :value="property.property_id"
                >
                  {{ property.name }}
                </option>
              </select>
              <font-awesome-icon class="select-chevron" icon="chevron-down" />
            </div>
            <button @click.prevent="addProperty" class="property-button">
              Lägg till Egenskap
            </button>
          </div>
          <ul>
            <li
              class="liPropertyStyles"
              v-for="(property, index) in properties"
              :key="index"
            >
              {{ property.name }}
              <button @click.prevent="removeProperty(index)">
                Ta Bort Denna Egenskapen
              </button>
            </li>
          </ul>
        </div>
        <div class="form-group-submit">
          <label for="featured"
            >Ska denna produkten vara på landningssidan?</label
          >
          <input
            :value="true"
            type="radio"
            id="featured"
            v-model="featured"
            class="custom-radio"
          />
        </div>
        <div class="form-group-submit">
          <button type="submit" class="submit-btn">Add Product</button>
        </div>
      </form>

      <div
        v-if="message"
        :class="[
          'message',
          message.includes('Error') ? 'error-message' : 'success-message',
        ]"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      productName: "",
      description: "",
      sizes: [{ size: "", price: "", stock_quantity: "" }],
      usageProducts: "",
      ingredients: "",
      properties: [],
      brand: "",
      featured: false,
      primaryImageFile: null,
      secondaryImageFile: null,
      thirdImageFile: null,
      categoryId: "",
      message: "",
      propertiesOnLoad: "",
      selectedProperty: "",
      brandsOnLoad: "",
      categoriesOnLoad: "",
      isLoading: false,
    };
  },
  created() {
    this.fetchProductProperties();
    this.fetchBrands();
    this.fetchCategories();
  },
  methods: {
    async fetchProductProperties() {
      try {
        const response = await axiosInstance.get(`/productproperties`);
        this.propertiesOnLoad = response.data.map((propertiesOnLoad) => ({
          ...propertiesOnLoad,
        }));
      } catch (error) {
        console.error(
          "Error fetching Product Properties:",
          error.response || error.message
        );
        Swal.fire(
          "Fel",
          "Fel vid hämtning av Produkt Egenskaper: Misslyckades med att hämta Produkt Egenskaper. Försök igen senare",
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
    addSize() {
      this.sizes.push({ size: "", price: 0, stock_quantity: 0 });
    },
    removeSize(index) {
      this.sizes.splice(index, 1);
    },
    addIngredient() {
      this.ingredients.push("");
    },
    removeIngredient(index) {
      this.ingredients.splice(index, 1);
    },
    addProperty() {
      if (this.selectedProperty) {
        const propertyExists = this.properties.some(
          (property) => property.property_id === this.selectedProperty
        );

        if (propertyExists) {
          Swal.fire("Fel", "Egenskapen har redan lagts till.", "error");
          return;
        }
        const selectedPropertyObject = this.propertiesOnLoad.find(
          (property) => property.property_id === this.selectedProperty
        );

        if (selectedPropertyObject) {
          this.properties.push({
            name: selectedPropertyObject.name,
            property_id: selectedPropertyObject.property_id,
          });
          this.selectedProperty = "";
        }
      }
    },
    removeProperty(index) {
      this.properties.splice(index, 1);
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
    async saveProduct() {
      const formData = new FormData();
      formData.append("product_name", this.productName);
      formData.append("description", this.description);
      formData.append("usage_products", this.usageProducts);
      formData.append("ingredients", this.ingredients);
      formData.append("category_id", parseInt(this.categoryId));
      formData.append("featured", this.featured);
      formData.append("properties", JSON.stringify(this.properties));
      formData.append("brand_id", parseInt(this.brand));

      if (this.primaryImageFile)
        formData.append("primaryImage", this.primaryImageFile);
      if (this.secondaryImageFile)
        formData.append("secondaryImage", this.secondaryImageFile);
      if (this.thirdImageFile)
        formData.append("thirdImage", this.thirdImageFile);

      this.sizes.forEach((size, i) => {
        formData.append(`variants[${i}][size]`, size.size);
        formData.append(`variants[${i}][price]`, size.price);
        formData.append(`variants[${i}][stock_quantity]`, size.stock_quantity);
      });

      try {
        this.isLoading = true;
        const response = await axiosInstance.post(`admin/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire(
          "Produkt skapad!",
          `Produkten "${this.productName}" har skapats.`,
          "success"
        );
        this.$emit("product-created", response.data.product);
        this.resetForm();
        this.isLoading = false;
      } catch (error) {
        console.error("Error adding product:", error);
        this.message =
          error.response?.data?.error ||
          error.message ||
          "Internal Server Error";

        // Get all error messages from the response
        const errorMessages =
          error.response?.data?.errors?.map((e) => e.msg).join("<br>") ||
          "Okänt fel uppstod. <br> Kolla så att du bara sätter in (jpeg, jpg, png, gif) som bilder.";

          Swal.fire(
            "Error",
            `Produkten kunde inte sparas. Kolla vad du har skrivit in och försök igen! <br> ${errorMessages}`,
            "error"
          );
        this.isLoading = false;
      }
      this.isLoading = false;
    },
    resetForm() {
      this.productName = "";
      this.description = "";
      this.sizes = [{ size: "", price: 0, stock_quantity: 0 }];
      this.usageProducts = "";
      this.ingredients = "";
      this.properties = [];
      this.featured = false;
      this.primaryImageFile = null;
      this.secondaryImageFile = null;
      this.thirdImageFile = null;
      this.categoryId = "";
      this.selectedProperty = "";
      this.brand = "";
    },
  },
};
</script>

<style scoped>
.header {
  padding-top: 20px;
  padding: 20px;
  padding-bottom: 20px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  justify-content: center;
  align-items: start;
  margin: 0 auto;
}

.header h2 {
  font-size: 32px;
}

button a {
  text-decoration: none;
  color: black;
  font-family: "Playfair Display", serif;
}

h1,
h2,
h3 h4 {
  font-family: "Playfair Display", serif;
  color: black;
}

button {
  padding-block: 0px;
  padding-inline: 0px;
  border-width: 0px;
  border-style: outset;
  border: 1px solid black;
  padding: 8px 16px;
  background-color: white;
  font-family: "Playfair Display", serif;
  cursor: pointer;
}

button:hover {
  background-color: black;
}

button:hover a,
button:hover p,
button:hover {
  color: white;
}

.create-product {
  margin: 0 auto;
  max-width: 900px;
  padding: 20px;
  background: rgb(245, 245, 245);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group-sizes {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.sizesButtonWrapper {
  display: flex;
  justify-content: space-between;
  padding-top: 7px;
}

.form-group-properties {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group-properties ul li {
  list-style: none;
}
.form-group-submit {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.selectPropertyWrapper {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.custom-select-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.custom-select-wrapper select {
  width: 100%;
  height: 100%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 2rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.custom-select-wrapper .select-chevron {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #999;
}
.property-button {
  width: 300px;
}

.liPropertyStyles {
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #000000;
  font-weight: 500;
  font-size: 14px;
}

input,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.submit-btn {
  background-color: #000000;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 50%;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: #27ae60;
}

/* Loading Indicator Styles */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #007bff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.submit-btn:active {
  transform: translateY(1px);
}
.size-entries {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.size-entry {
  width: calc(33% - 8px);
}
.size-header {
  display: flex;
  gap: 32px;
  align-items: center;
  margin-bottom: 8px;
}
.message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.submit-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.custom-radio {
  padding: 0px;
  margin-left: 15px;
  margin-bottom: 10px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #333;
  background-color: white;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.custom-radio:checked {
  background-color: #000000;
  border-color: #ffffff;
}

select {
  color: #000000;
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

@media (max-width: 768px) {
  input,
  select,
  textarea {
    font-size: 16px;
  }
  .create-product {
    padding: 15px;
    margin: 10px;
  }

  h1,
  h2,
  h3,
  h4 {
    font-size: 24px;
  }
  .header h2 {
    font-size: 24px;
  }
  button {
    padding: 4px 8px;
    font-size: 16px;
  }
  .property-button {
    width: 50%;
  }
  .size-header {
    justify-content: space-between;
  }
  .size-entries {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .size-entry {
    width: calc(100%);
  }
  .submit-btn {
    width: 100%;
  }
}
</style>
