<template>
  <div class="service-container">
    <router-link to="/admin" class="back"
      ><font-awesome-icon icon="chevron-left" /> Tillbaka</router-link
    >
    <h1>Behandlingar</h1>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- Add/Edit Service Form -->
    <div class="form-container" ref="formContainer">
      <h2>{{ isEditing ? "Ändra Behandling" : "Lägg till ny Behandling" }}</h2>
      <form
        @submit.prevent="isEditing ? updateService() : addService()"
        enctype="multipart/form-data"
      >
        <!-- Name -->
        <div class="form-group">
          <label for="name">Namn:</label>
          <input v-model="form.name" type="text" id="name" required />
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description">Beskrivning:</label>
          <textarea
            v-model="form.description"
            id="description"
            required
          ></textarea>
        </div>

        <!-- Price -->
        <div class="form-group">
          <label for="price">Pris:</label>
          <input
            v-model.number="form.price"
            type="number"
            id="price"
            min="0"
            step="0.01"
            required
          />
        </div>

        <!-- Schedule -->
        <div class="form-group">
          <label for="schedule">Tid (minuter):</label>
          <input v-model="form.time" id="schedule" type="number" required />
        </div>

        <!-- Before Image Upload -->
        <div class="form-group">
          <label for="before_image_upload">Ladda upp före bild:</label>
          <input
            type="file"
            id="before_image_upload"
            @change="handleImageUpload('before', $event)"
            accept="image/*"
            :required="!isEditing || selectedBeforeImage"
          />
          <!-- Image Preview -->
          <div v-if="imageBeforePreview">
            <img
              :src="imageBeforePreview"
              alt="Image Before Preview"
              class="image-preview"
              @click="removeImage('before')"
            />
          </div>
        </div>

        <!-- After Image Upload -->
        <div class="form-group">
          <label for="after_image_upload">Ladda upp efter bild:</label>
          <input
            type="file"
            id="after_image_upload"
            @change="handleImageUpload('after', $event)"
            accept="image/*"
            :required="!isEditing || selectedAfterImage"
          />
          <!-- Image Preview -->
          <div v-if="imageAfterPreview">
            <img
              :src="imageAfterPreview"
              alt="Image After Preview"
              class="image-preview"
              @click="removeImage('after')"
            />
          </div>
        </div>

        <!-- Booking Link -->
        <div class="form-group">
          <label for="booking_link">Bokningslänk (bokadirekt):</label>
          <input
            v-model="form.booking_link"
            type="url"
            id="booking_link"
            placeholder="https://example.com/book"
          />
        </div>

        <!-- Category Selection -->
        <div class="form-group">
          <label for="categoryId">Kategori:</label>
          <select
            v-model.number="form.category"
            name="categoryId"
            id="categoryId"
            required
          >
            <option value="" disabled>Välj kategori</option>
            <option
              v-for="category in categories"
              :key="category.category_id"
              :value="category.category_id"
            >
              {{ category.category_name }}
            </option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="button-group">
          <button type="submit">
            {{ isEditing ? "Updatera" : "Lägg till" }} Kurs
          </button>
          <button type="button" v-if="isEditing" @click="cancelEdit">
            Avbryt
          </button>
        </div>
      </form>
    </div>

    <!-- Service List -->
    <div class="list-container">
      <h2>Alla Behandlingar</h2>
      <table>
        <thead>
          <tr>
            <th>Kursnamn</th>
            <th>Beskrivning</th>
            <th>Pris</th>
            <th>Tid</th>
            <th>Före Bild</th>
            <th>Efter Bild</th>
            <th>Kategori</th>
            <th>Bokningslänk</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in services" :key="service.service_id">
            <td>{{ service.name }}</td>
            <td>{{ service.description }}</td>
            <td>{{ formatPrice(service.price) }}</td>
            <td>{{ service.time }}</td>
            <td>
              <img
                :src="service.before_image_url"
                alt="Service Before Image"
                class="service-before-image"
              />
            </td>
            <td>
              <img
                :src="service.after_image_url"
                alt="Service After Image"
                class="service-after-image"
              />
            </td>
            <td>
              {{ getCategoryName(service.category_id) }}
            </td>
            <td>
              <a :href="service.booking_link" target="_blank">Boka nu</a>
            </td>

            <td>
              <button @click="editService(service)">Ändra</button>
              <button @click="deleteService(service.service_id)">
                Ta bort
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";

import Swal from "sweetalert2";

export default {
  name: "ServiceView",
  data() {
    return {
      services: [],
      categories: [], // For dynamic category selection
      form: {
        service_id: null, // Used for editing
        name: "",
        description: "",
        price: 0,
        time: 0,
        booking_link: "",
        category: null, // Initialize as null
      },
      selectedBeforeImage: null, // Store the selected "before" image file
      selectedAfterImage: null, // Store the selected "after" image file
      imageBeforePreview: null, // Store the "before" image preview URL
      imageAfterPreview: null, // Store the "after" image preview URL
      isEditing: false,
      isLoading: false, // For loading indicator
    };
  },
  created() {
    this.fetchServices();
    this.fetchCategories(); // Fetch categories on component creation
  },
  methods: {
    /**
     * Fetch all services from the backend.
     */
    async fetchServices() {
      this.isLoading = true;
      try {
        const response = await axiosInstance.get(`/services`);
        this.services = response.data.map((service) => ({
          ...service,
          price: Number(service.price), // Ensure 'price' is a number
        }));
      } catch (error) {
        Swal.fire(
          "Fel",
          "Fel vid hämtning av behandlingar: Misslyckades med att hämta behandlingar. Försök igen senare",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch all categories from the backend.
     */
    async fetchCategories() {
      this.isLoading = true;
      try {
        const response = await axiosInstance.get(`/services-categories`);
        this.categories = response.data;
      } catch (error) {
        Swal.fire(
          "Fel",
          "Det gick inte att hämta kategorier. Vänligen försök igen senare.",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Handle image selection and generate a preview.
     * @param {string} type - Type of image ('before' or 'after')
     * @param {Event} event - The change event
     */
    handleImageUpload(type, event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate image type
      if (!file.type.startsWith("image/")) {
        Swal.fire("Fel", "Vänligen ladda upp en giltig bildfil.", "error");
        if (type === "before") {
          this.selectedBeforeImage = null;
          this.imageBeforePreview = null;
        } else if (type === "after") {
          this.selectedAfterImage = null;
          this.imageAfterPreview = null;
        }
        return;
      }

      if (type === "before") {
        this.selectedBeforeImage = file;

        // Generate image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageBeforePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else if (type === "after") {
        this.selectedAfterImage = file;

        // Generate image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageAfterPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    removeImage(type) {
      if (type === "before") {
        this.selectedBeforeImage = null;
        this.imageBeforePreview = null;
      } else if (type === "after") {
        this.selectedAfterImage = null;
        this.imageAfterPreview = null;
      }
    },
    /**
     * Add a new service with image upload.
     */
    async addService() {
      // Validate that both images have been selected
      if (!this.selectedBeforeImage || !this.selectedAfterImage) {
        Swal.fire(
          "Fel",
          "Vänligen välj både bild före och efter för att ladda upp.",
          "error"
        );

        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("beforeImage", this.selectedBeforeImage);
      formData.append("afterImage", this.selectedAfterImage);
      formData.append("name", this.form.name);
      formData.append("description", this.form.description);
      formData.append("price", this.form.price);
      formData.append("time", this.form.time);
      formData.append("category_id", this.form.category);
      formData.append(
        "booking_link",
        this.form.booking_link || "https://www.snbeauty.se/kontakt"
      );

      try {
        this.isLoading = true;
        const response = await axiosInstance.post(`/services`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const addedService = {
          ...response.data,
          price: Number(response.data.price), // Ensure 'price' is a number
        };
        this.services.push(addedService);
        this.resetForm();
        Swal.fire(
          "Framgång",
          "Tjänsten har lagts till framgångsrikt!",
          "success"
        );
      } catch (error) {
        const errorMessages = error.response.data.errors
          .map((error) => error.msg)
          .join("<br>");

        // Display all error messages in the alert
        Swal.fire(
          "Error",
          `Behandling kunde inte läggas till. Kolla vad du har skrivit in och försök igen! <br> ${errorMessages}`,
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Prepare to edit a service by pre-filling the form.
     */
    editService(service) {
      this.isEditing = true;
      this.form = { ...service };
      this.form.price = Number(this.form.price); // Ensure 'price' is a number
      this.form.category = service.category_id; // Ensure category is set
      // Display the existing image as a preview
      this.imageBeforePreview = service.before_image_url;
      this.imageAfterPreview = service.after_image_url;

      // Reset selectedImage as the user hasn't selected a new image yet
      this.selectedBeforeImage = null;
      this.selectedAfterImage = null;

      this.$nextTick(() => {
        this.$refs.formContainer.scrollIntoView({ behavior: "smooth" });
      });
    },

    /**
     * Update an existing service with optional image upload.
     */
    async updateService() {
      const formData = new FormData();

      if (this.selectedBeforeImage) {
        formData.append("beforeImage", this.selectedBeforeImage);
      } else {
        formData.append("before_image_url", this.imageBeforePreview);
      }

      if (this.selectedAfterImage) {
        formData.append("afterImage", this.selectedAfterImage);
      } else {
        formData.append("after_image_url", this.imageAfterPreview);
      }

      formData.append("name", this.form.name);
      formData.append("description", this.form.description);
      formData.append("price", this.form.price);
      formData.append("time", this.form.time);
      formData.append("booking_link", this.form.booking_link);
      formData.append("category_id", this.form.category);

      try {
        this.isLoading = true;
        const response = await axiosInstance.put(
          `/services/${this.form.service_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedServiceData = {
          ...response.data,
          price: Number(response.data.price), // Ensure 'price' is a number
        };

        // Update services array with the new data
        const index = this.services.findIndex(
          (c) => c.service_id === this.form.service_id
        );
        if (index !== -1) {
          this.services.splice(index, 1, updatedServiceData);
        }

        this.resetForm();
        this.isEditing = false;
        Swal.fire(
          "Framgång",
          "Tjänsten har uppdaterats framgångsrikt!",
          "success"
        );
      } catch (error) {
        const errorMessages = error.response.data.errors
          .map((error) => error.msg)
          .join("<br>");

        // Display all error messages in the alert
        Swal.fire(
          "Error",
          `Behandlingen kunde inte uppdateras. Kolla vad du har skrivit in och försök igen! <br> ${errorMessages}`,
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * Delete a service.
     */
    async deleteService(service_id) {
      const result = await Swal.fire({
        title: "Är du säker?",
        text: "Vill du verkligen ta bort den här tjänsten? Denna åtgärd kan inte ångras.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ja, ta bort den!",
        cancelButtonText: "Avbryt",
      });

      // Check if the user confirmed the action
      if (!result.isConfirmed) return;

      try {
        this.isLoading = true;
        await axiosInstance.delete(`/services/${service_id}`);
        this.services = this.services.filter(
          (service) => service.service_id !== service_id
        );
        Swal.fire(
          "Raderad!",
          "Tjänsten har raderats framgångsrikt!",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Fel",
          "Det gick inte att ta bort tjänsten. Vänligen försök igen senare.",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Reset the form fields and clear image selections.
     */
    resetForm() {
      // Maintain service_id if editing
      const previousServiceId = this.isEditing ? this.form.service_id : null;

      this.form = {
        service_id: previousServiceId, // Keep the previous service ID
        name: "",
        description: "",
        price: 0,
        time: 0,
        booking_link: "",
        category: "",
      };

      this.selectedAfterImage = null;
      this.selectedBeforeImage = null;
      this.imageBeforePreview = null;
      this.imageAfterPreview = null;

      // Reset the file input values
      const beforeFileInput = document.getElementById("before_image_upload");
      if (beforeFileInput) {
        beforeFileInput.value = "";
      }
      const afterFileInput = document.getElementById("after_image_upload");
      if (afterFileInput) {
        afterFileInput.value = "";
      }
    },

    /**
     * Cancel editing and reset the form.
     */
    cancelEdit() {
      this.resetForm();
      this.isEditing = false;
    },

    /**
     * Format price safely.
     */
    formatPrice(price) {
      if (isNaN(price)) return "N/A";
      return Number(price).toFixed(2);
    },

    /**
     * Get category name by ID.
     * @param {number} categoryId
     * @returns {string}
     */
    getCategoryName(categoryId) {
      const category = this.categories.find(
        (c) => c.category_id === categoryId
      );
      return category ? category.category_name : "Unknown";
    },
  },
};
</script>

<style scoped>
textarea,
input.text,
input[type="text"],
input[type="file"],
input[type="button"],
input[type="submit"],
input[type="”search”"],
input[type="datetime-local"],
select,
.input-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none; /* firefox browser */

  border-radius: 0;
}
.back {
  text-decoration: none;
  color: black;
  font-size: 14px;
  border: 1px solid black;
  padding: 8px 16px;
  font-family: "Playfair Display", serif;
  position: absolute;
  transform: translate(0%, -50%);
}

.back:hover {
  color: white;
  background-color: #202020;
}

.service-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #555;
}

h1 {
  color: #333;
}

h1,
h2 {
  font-family: "Playfair Display", serif;
  text-align: center;
  margin-bottom: 20px;
}

.form-container,
.list-container {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 40px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.form-group label {
  width: 150px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: flex-start;
}

.button-group button {
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button-group button[type="submit"] {
  background-color: #28a745;
  color: #fff;
}

.button-group button[type="button"] {
  background-color: #6c757d;
  color: #fff;
}

.button-group button:hover {
  opacity: 0.9;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

thead {
  background-color: #f8f9fa;
}

th,
td {
  padding: 12px;
  border: 1px solid #dee2e6;
  text-align: left;
  word-wrap: break-word;
}

th {
  font-weight: bold;
}

#schedule {
  flex: 0;
}

.service-after-image,
.service-before-image {
  width: 100px;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  padding: 6px 12px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:first-of-type {
  background-color: #007bff;
  color: #fff;
}

button:last-of-type {
  background-color: #dc3545;
  color: #fff;
}

button:hover {
  opacity: 0.8;
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

/* Image Preview Styles */
.image-preview {
  width: 150px;
  height: auto;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

tr:nth-child(2n) {
  background-color: #f8f8f8; /* Light gray background for every second td */
}

/* Responsive Design */
@media (max-width: 768px) {
  input,
  select {
    font-size: 16px;
  }
  h1 {
    margin-top: 31px;
    font-size: 1.5em;
  }
  h2 {
    font-size: 1.3em;
  }
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }
  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
  }
  #schedule {
    width: fit-content;
  }
  .form-group label {
    width: 100%;
    margin-bottom: 5px;
  }

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  th {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    margin-bottom: 15px;
  }

  td {
    position: relative;
    padding-left: 50%;
    border: none;
    border-bottom: 1px solid #dee2e6;
  }

  td::before {
    position: absolute;
    top: 12px;
    left: 12px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    font-weight: bold;
  }

  td:nth-of-type(1)::before {
    content: "Kursnamn";
  }
  td:nth-of-type(2)::before {
    content: "Beskrivning";
  }
  td:nth-of-type(3)::before {
    content: "Pris";
  }
  td:nth-of-type(4)::before {
    content: "Tid";
  }
  td:nth-of-type(5)::before {
    content: "Före Bild";
  }
  td:nth-of-type(6)::before {
    content: "Efter Bild";
  }
  td:nth-of-type(7)::before {
    content: "Kategori";
  }
  td:nth-of-type(8)::before {
    content: "Bokningslänk";
  }
  td:nth-of-type(9)::before {
    content: "Åtgärder";
  }

  h1,
  h2 {
    margin-top: 30px;
  }
}
</style>
