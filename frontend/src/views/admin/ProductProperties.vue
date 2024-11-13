<template>
    <div class="course-container">
      <router-link to="/admin" class="back"
      ><font-awesome-icon icon="chevron-left" /> Tillbaka</router-link>
      <h1 class="produktEgenskaper">Produkt Egenskaper</h1>
  
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <!-- Add/Edit Course Form -->
      <div class="form-container" ref="formContainer">
        <h2>{{ isEditing ? "Ändra ProduktEgenskap" : "Lägg till ny Produkt Egenskap" }}</h2>
        <form
          @submit.prevent="isEditing ? updateProperty() : addProperty()"
        >
          <!-- Name -->
          <div class="form-group">
            <label for="name">Namn för egenskap:</label>
            <input v-model="form.name" type="text" id="name" required />
          </div>
  
          <!-- Buttons -->
          <div class="button-group">
            <button type="submit">
              {{ isEditing ? "Updatera" : "Lägg till" }} Egenskap
            </button>
            <button type="button" v-if="isEditing" @click="cancelEdit">
              Avbryt
            </button>
          </div>
        </form>
      </div>
  
      <!-- Courses List -->
      <div class="list-container">
        <h2>Alla Egenskaper</h2>
        <table>
          <thead>
            <tr>
              <th>Egenskapsnamn</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="property in properties" :key="property.property_id">
              <td>{{ property.name }}</td>
              
              <td>
                <button @click="editProperty(property)">Edit</button>
                <button @click="deleteProperty(property.property_id)">Delete</button>
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
    name: "PropertyView",
    data() {
      return {
        properties: [],
        form: {
          property_id: null, // Used for editing
          name: "",
        },
        isEditing: false,
        isLoading: false, // For loading indicator
      };
    },
    created() {
      this.fetchProperties();
    },
    methods: {
      /**
       * Fetch all properties from the backend.
       */
      async fetchProperties() {
        this.isLoading = true;
        try {
          const response = await axiosInstance.get(`/productproperties`);
          this.properties = response.data.map((property) => ({
            ...property,
          }));
        } catch (error) {
          console.error(
            "Error fetching properties:",
            error.response || error.message
          );
          Swal.fire(
            "Error",
            "Failed to fetch properties. Please try again later.",
            "error"
          );
        } finally {
          this.isLoading = false;
        }
      },
      
      /**
       * Add a new Property
       */
      async addProperty() {
        try {
          this.isLoading = true;
          const response = await axiosInstance.post(`/productproperties`, this.form);
          this.properties.push(response.data);
          this.resetForm();
          Swal.fire("Success", "Property added successfully!", "success");
        } catch (error) {
          console.error("Error adding property:", error);
          Swal.fire("Error", "Failed to add property. Please try again.", "error");
        } finally {
          this.isLoading = false;
        }
      },
      
      /**
       * Prepare to edit a property by pre-filling the form.
       */
      editProperty(property) {
        this.isEditing = true;
        this.form = { ...property };
  
        this.$nextTick(() => {
          this.$refs.formContainer.scrollIntoView({ behavior: "smooth" });
        });
      },
  
      /**
       * Update an existing property.
       */
      async updateProperty() {
        try {
          this.isLoading = true;
          const response = await axiosInstance.put(
            `/productproperties/${this.form.property_id}`, // Use the correct endpoint
            {
              name: this.form.name,
            }
          );
  
          const updatedPropertyData = response.data;

          // Update properties array with the new data
          const index = this.properties.findIndex(
            (property) => property.property_id === this.form.property_id
          );
          if (index !== -1) {
            this.properties.splice(index, 1, updatedPropertyData);
          }
  
          this.resetForm();
          this.isEditing = false;
          Swal.fire("Success", "Property updated successfully!", "success");
        } catch (error) {
          console.error(
            "Error updating property:",
            error.response || error.message
          );
          Swal.fire(
            "Error",
            "Failed to update property. Please check your input and try again.",
            "error"
          );
        } finally {
          this.isLoading = false;
        }
      },
  
      /**
       * Delete a property.
       */
      async deleteProperty(property_id) {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you really want to delete this property? This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
        });
  
        if (!result.isConfirmed) return;
  
        try {
          this.isLoading = true;
          await axiosInstance.delete(`/productproperties/${property_id}`);
          this.properties = this.properties.filter(
            (property) => property.property_id !== property_id
          );
          Swal.fire("Deleted!", "Property deleted successfully!", "success");
        } catch (error) {
          console.error(
            "Error deleting property:",
            error.response || error.message
          );
          Swal.fire(
            "Error",
            "Failed to delete property. Please try again later.",
            "error"
          );
        } finally {
          this.isLoading = false;
        }
      },
  
      resetForm() {
        this.form = {
          property_id: null,
          name: "",
        };
      },
  
      /**
       * Cancel editing and reset the form.
       */
      cancelEdit() {
        this.resetForm();
        this.isEditing = false;
      },
    },
  };
</script>


  <style scoped>

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

  .back:hover{
    color: white;
    background-color: #202020;
  }

  .course-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
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
  .form-group textarea {
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
  
  .course-image {
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
    .form-group {
      flex-direction: column;
      align-items: flex-start;
    }
    .form-group input,
    .form-group textarea {
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
      content: "ID";
    }
    td:nth-of-type(2)::before {
      content: "Name";
    }
    td:nth-of-type(3)::before {
      content: "Description";
    }
    td:nth-of-type(4)::before {
      content: "Price ($)";
    }
    td:nth-of-type(5)::before {
      content: "Schedule";
    }
    td:nth-of-type(6)::before {
      content: "Image";
    }
    td:nth-of-type(7)::before {
      content: "Booking Link";
    }
    td:nth-of-type(8)::before {
      content: "Actions";
    }
  }

  @media (max-width: 600px) {
    h1, h2{
      font-size: 18px;
    }
    p, #text{
      font-size: 12px;
    }
    .produktEgenskaper{
      margin-top: 30px;
    }
  }
  </style>
  