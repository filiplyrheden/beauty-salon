<template>
  <div class="events-and-courses-container">

    <h1>Our Courses</h1>

    <!-- Show message if no courses are available -->
    <div v-if="courses.length === 0" class="no-courses">
      No Courses available at the moment.
    </div>

    <!-- List of courses if they are available -->
    <div v-else class="courses">
      <div v-for="course in courses" :key="course.course_id">
        <div class="course-item">
          <div class="course-name">{{ course.name }}</div>
        </div>
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
      courses: [],
      isLoading: false,
      isPopupVisible: false, // For popup visibility
    };
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await axiosInstance.get(`/courses`);
        this.courses = response.data.map((course) => ({
          ...course,
        }));
      } catch (error) {
        console.error(
          "Error fetching courses:",
          error.response || error.message
        );
        Swal.fire(
          "Fel",
          "Fel vid hämtning av Kurser: Misslyckades med att hämta kurser. Försök igen senare",
          "error"
        );
      }
    },


  },
  created() {
    this.fetchCourses();
  },
};
</script>

<style scoped>
/* Main container for services page */
.services-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
}

/* Title */
h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 40px;
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
  color: #f00;
}

/* Category container */
.category {
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

/* Category name styling */
.category-name {
  font-size: 1.8rem;
  color: #0056b3;
  border-bottom: 2px solid #0056b3;
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
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

/* Hover effect for service item */
.service-item:hover {
  transform: translateY(-3px);
}

/* Service name */
.service-name {
  font-size: 1.1rem;
  color: #333;
}

/* Service price */
.service-price {
  font-size: 1.1rem;
  color: #007bff;
  font-weight: bold;
}
.more-info {
  color: #007bff;
  cursor: pointer;
}
.more-info:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .services-container {
    padding: 15px;
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
