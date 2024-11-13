<template>
  <div class="header">
    <button>
      <router-link to="/admin" class="back">Tillbaka</router-link>
    </button>
    <h2>Add New Product</h2>
  </div>
  <div class="create-product">
    <form
      id="uploadForm"
      @submit.prevent="saveProduct"
      enctype="multipart/form-data"
    >
      <!-- Existing Fields -->
      <div class="form-group">
        <label for="productName">Produktnamn</label>
        <input
          type="text"
          id="productName"
          v-model="productName"
          required
          placeholder="Enter product name"
        />
      </div>

      <div class="form-group">
        <label for="description">Beskrivning</label>
        <textarea
          id="description"
          v-model="description"
          required
          placeholder="Enter product description"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="categoryId">Kategori</label>
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
      </div>
      <div class="form-group">
        <label for="brand">Märke</label>
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
      </div>
      <!-- Sizes Section -->
      <div class="form-group-sizes">
        <label for="sizes">Storlekar och Priser</label>
        <div v-for="(size, index) in sizes" :key="index" class="size-entry">
          <input
            v-model="size.sizeName"
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
            v-model.number="size.quantity"
            type="number"
            placeholder="Kvantitet (10, 20, 30)"
            required
          />
          <div class="sizesButtonWrapper">
            <button @click.prevent="removeSize(index)">Ta Bort Denna Storleken</button>
            <button class="addSizes" @click.prevent="addSize">Lägg Till Storlek</button>
          </div>
        </div>
      </div>

      <!-- Usage Products Section -->
      <div class="form-group">
        <label for="usageProducts">Användarinstruktioner</label>
        <textarea
          id="usageProducts"
          v-model="usageProducts"
          placeholder="Användarinstruktioner"
        ></textarea>
      </div>

      <!-- Ingredients Section -->
      <div class="form-group">
        <label for="ingredients">Ingredienser</label>
        <textarea
          id="ingredients"
          v-model="ingredients"
          required
          placeholder="Skriv in alla ingredienser separerade med kommatecken (t.ex. Vatten, Glycerin, Doft)."
        ></textarea>
      </div>

      <!-- Image Fields and Submit Button -->
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

      <!-- Properties Section -->
      <div class="form-group-properties">
        <label for="property">Egenskaper</label>
        <div class="selectPropertyWrapper">
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
          <button @click.prevent="addProperty">Lägg till Egenskap</button>
        </div>
        <ul>
          <li class="liPropertyStyles" v-for="(property, index) in properties" :key="index">
              {{ property.name }}
            <button @click.prevent="removeProperty(index)">Ta Bort Denna Egenskapen</button>
          </li>
        </ul>
      </div>
      <div class="form-group-submit">
        <label for="featured"
          >Ska denna produkten vara på landningssidan?</label
        >
        <input :value="true" type="radio" id="featured" v-model="featured" class="custom-radio" />
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
</template>

<script>
import axiosInstance from "@/services/axiosConfig";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      productName: "",
      description: "",
      sizes: [{ sizeName: "", price: "", quantity: "" }],
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
      this.sizes.push({ sizeName: "", price: 0, quantity: 0 });
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
        // Check if the property is already in the properties array
        const propertyExists = this.properties.some(
          (property) => property.property_id === this.selectedProperty
        );

        if (propertyExists) {
          // Show an error message using SweetAlert
          Swal.fire("Fel", "Egenskapen har redan lagts till.", "error");
          return; // Exit the function if the property already exists
        }

        console.log(this.selectedProperty);

        // Find the selected property object from propertiesOnLoad
        const selectedPropertyObject = this.propertiesOnLoad.find(
          (property) => property.property_id === this.selectedProperty
        );
        console.log(selectedPropertyObject);

        if (selectedPropertyObject) {
          this.properties.push({
            name: selectedPropertyObject.name,
            property_id: selectedPropertyObject.property_id,
          });
          this.selectedProperty = ""; // Reset selected property after adding
          console.log(this.properties);
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
      formData.append("sizes", JSON.stringify(this.sizes));
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

      try {
        const response = await axiosInstance.post(`admin/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Response:", response);
        Swal.fire(
          "Produkt skapad!",
          `Produkten "${this.productName}" har skapats.`,
          "success"
        );
        this.resetForm();
      } catch (error) {
        console.error("Error adding product:", error);
        this.message =
          error.response?.data?.error ||
          error.message ||
          "Internal Server Error";
          Swal.fire(
          "Något blev fel under skapandet av din produkt.",
          `Produkten "${this.productName}" kunde inte skapas.`,
          "error"
        );
      }
    },
    resetForm() {
      this.productName = "";
      this.description = "";
      this.sizes = [{ sizeName: "", price: 0, quantity: 0 }];
      this.usageProducts = "";
      this.ingredients = "";
      this.properties = []; // Reset properties to an empty array
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

.header{
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

.header h2{
  font-size: 32px;
}

button a{
  text-decoration: none;
  color: black;
  font-family: "Playfair Display", serif;
}

h1, h2 ,h3 h4{
  font-family: "Playfair Display", serif;
  color: black;
}

button{
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

button:hover{
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
margin-bottom: 20px
}

.form-group-sizes {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.sizesButtonWrapper{
  display: flex;
  justify-content: space-between;
  padding-top: 7px;
}

.form-group-properties{
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}


.form-group-properties ul li{
  list-style: none;
}
.form-group-submit{
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.selectPropertyWrapper{
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.liPropertyStyles{
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

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
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

.submit-btn:active {
  transform: translateY(1px);
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

/* Optional loading state for button */
.submit-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

/* Hide default radio button */
.custom-radio {
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

/* Style when radio button is checked */
.custom-radio:checked {
  background-color: #000000; /* Change to your preferred color */
  border-color: #ffffff;
}   

/* Responsive design */
@media (max-width: 768px) {
  .create-product {
    padding: 15px;
    margin: 10px;
  }

  h1, h2, h3, h4 {
    font-size: 24px;
  }
  .header h2{
    font-size: 24px;
  }
  button{
    padding: 4px 8px;
    font-size: 10px;
  }
}
</style>
