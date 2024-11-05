<template>
  <div>
    <div class="hero-container">
      <div class="hero">
        <img class="hero-image" src="../../assets/treatments.png" alt="" />
        <div class="hero-overlay"></div>
        <h1>BEHANDLINGAR</h1>
      </div>
    </div>
    <div class="services-container">
      <!-- Show loading state -->
      <div v-if="isLoading" class="loading">Loading...</div>

      <!-- Show message if no services are available -->
      <div v-else-if="categoriesWithServices.length === 0" class="no-services">
        No services available at the moment.
      </div>

      <!-- List of services under each category -->
      <div v-else class="categories">
        <div
          v-for="category in categoriesWithServices"
          :key="category.id"
          class="category"
        >
          <h2 class="category-name">
            {{ category.category_name.toUpperCase() }}
          </h2>

          <!-- List services -->
          <ul class="services-list">
            <li
              v-for="service in category.services"
              :key="service.id"
              class="service-item"
            >
              <span class="service-name">{{ service.name }}</span>
              <span class="service-time">{{ service.time }} min</span>
              <span class="service-price">{{ service.price }} SEK</span>
              <span class="more-info" @click="openDescriptionModal(service)">
                Mer info
              </span>
              <a :href="service.booking_link">
                <button>BOKA</button>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Service Popup Modal -->
      <ServicePopup
        v-if="isPopupVisible"
        :isVisible="isPopupVisible"
        :service="selectedService"
        @close="closeDescriptionModal"
      />
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";
import Swal from "sweetalert2";
import ServicePopup from "@/components/ServicePopUp.vue";

export default {
  components: {
    ServicePopup,
  },
  data() {
    return {
      services: [],
      categories: [],
      isLoading: false,
      isPopupVisible: false, // For popup visibility
      selectedService: {}, // Selected service for more info
    };
  },
  computed: {
    // Group services under their categories and filter out empty categories
    categoriesWithServices() {
      return this.categories
        .map((category) => {
          const services = this.services.filter(
            (service) => service.category_id === category.category_id
          );
          return {
            ...category,
            services,
          };
        })
        .filter((category) => category.services.length > 0); // Only include categories with services
    },
  },
  methods: {
    async fetchServicesAndCategories() {
      this.isLoading = true;
      try {
        await Promise.all([this.fetchServices(), this.fetchCategories()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchServices() {
      try {
        const response = await axiosInstance.get(`/services`);
        this.services = response.data.map((service) => ({
          ...service,
          price: Number(service.price), // Ensure 'price' is a number
        }));
      } catch (error) {
        console.error(
          "Error fetching services:",
          error.response || error.message
        );
        Swal.fire(
          "Fel",
          "Fel vid hämtning av behandlingar: Misslyckades med att hämta behandlingar. Försök igen senare",
          "error"
        );
      }
    },

    async fetchCategories() {
      try {
        const response = await axiosInstance.get(`/services-categories`);
        this.categories = response.data.map((category) => ({
          ...category,
        }));
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error.response || error.message
        );
        Swal.fire(
          "Error",
          "Failed to fetch categories. Please try again later.",
          "error"
        );
      }
    },

    openDescriptionModal(service) {
      this.selectedService = service; // Set the selected service
      this.isPopupVisible = true; // Show the popup
    },
    closeDescriptionModal() {
      this.isPopupVisible = false; // Hide the popup
      this.selectedService = {}; // Reset selected service
    },
  },
  created() {
    this.fetchServicesAndCategories(); // Fetch data when the component is created
  },
};
</script>

<style scoped>
/* Main container for services page */

.hero-container {
  width: 100%;
  height: 60vh;
}
.hero {
  max-width: 1280px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
  margin: 0 auto;
}
.hero img {
  object-fit: cover;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  object-position: 50% 50%;
}
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.hero h1 {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  font-size: 8em;
  font-family: "Playfair Display", serif !important;
  color: white;
  letter-spacing: 4%;
  line-height: 180.78px;
  font-weight: 600;
}
.services-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px 20px 20px;
  font-family: "Arial", sans-serif;
}

/* Loading state */
.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
}

/* No services message */
.no-services {
  text-align: center;
  font-size: 1.2rem;
}

/* Category container */
.category {
  margin-bottom: 30px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

/* Category name styling */
.category-name {
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  color: black;
  border-bottom: 1px solid black;
  padding-bottom: 5px;
  margin-bottom: 20px;
}

/* Services list */
.services-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Each service item */
.service-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: #fff;
  align-items: center;
  transition: transform 0.2s ease;
}

/* Service name */
.service-name {
  font-size: 1.1rem;
  color: #333;
}

/* Service price */
.service-price {
  font-size: 1.1rem;
  color: #333;
  font-weight: bold;
}
.more-info {
  color: #333;
  cursor: pointer;
}
.more-info:hover {
  text-decoration: underline;
}
button {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-weight: 600;
  padding: 8px 16px;
  border: 1px solid black;
  background: black;
  color: white;
}
button:hover {
  cursor: pointer;
  background: white;
  color: black;
}
/* Responsive adjustments */
@media (max-width: 600px) {
  .services-container {
    padding: 32px 15px 15px 15px;
  }

  .service-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .service-price {
    margin-top: 5px;
  }
}
</style>
