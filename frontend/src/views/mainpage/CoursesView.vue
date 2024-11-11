<template>
  <div>
    <div class="hero-container">
      <div class="hero">
        <img class="hero-image" src="../../assets/courses.png" alt="" />
        <div class="hero-overlay"></div>
        <h1>KURSER</h1>
      </div>
    </div>
    <div class="courses-container">
      <div class="courses-section">
        <div class="courses-description">
          <div class="title">
            Låt Shahad vägleda dig i skönhetsvärlden med professionella kurser!
          </div>
          <div class="description">
            Vill du utveckla dina sminkkunskaper eller kanske ta dina
            färdigheter till nästa nivå? Shahad erbjuder en rad kurser och
            utbildningar inom makeup och skönhet – från grundläggande
            sminkkurser till avancerade tekniker och workshops för både
            nybörjare och erfarna entusiaster. Varje kurs är noggrant utformad
            för att ge dig verktygen och kunskapen du behöver för att skapa
            imponerande looks med självförtroende. Anmäl dig nu via Bokadirekt,
            eller kontakta oss direkt för en skräddarsydd kurs och fördjupa dig
            i en värld av färg, teknik och kreativitet!
          </div>
          <router-link to="/om-mig">
            <button>KONTAKTA SHAHAD FÖR EN SKRÄDDARSYDD KURS</button>
          </router-link>
        </div>
        <div class="courses">
          <h2 class="courses-title">KOMMANDE KURSER</h2>
          <div v-if="isLoading" class="loading">Loading...</div>

          <!-- Show message if no courses are available -->
          <div v-else-if="courses.length === 0" class="no-courses">
            Det finns inga kurser just nu, kontakta mig för att skapa din egna
            skräddarsydda kurs.
          </div>

          <!-- List of courses if they are available -->
          <div v-else class="all-courses">
            <div
              v-for="course in courses"
              :key="course.course_id"
              class="course-item-container"
            >
              <div class="course-item">
                <img
                  src="../../assets/courses.png"
                  alt="kurs bild"
                  class="course-image"
                />
                <div class="course-name">{{ course.name }}</div>
                <div class="schedule">{{ formatDate(course.schedule) }}</div>
                <div class="course-description">{{ course.description }}</div>
              </div>
              <!-- todo: change to :src="course.image_url" to reflect the images of each course-->
              <div class="button-price">
                <a :href="course.booking_link"
                  ><button class="booking-link">BOKA</button></a
                >
                <div class="price">{{ course.price }} kr</div>
              </div>
            </div>
          </div>
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
    formatDate(datetime) {
      if (!datetime) return "N/A";
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(datetime).toLocaleDateString(undefined, options);
    },
  },
  created() {
    this.fetchCourses();
  },
};
</script>

<style scoped>
.hero-container {
  width: 100%;
  height: 60vh;
}
.courses-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
}
.courses {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 32px;
}
.all-courses {
  display: flex;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
}
.course-item-container {
  width: calc(50% - 8px);
  min-height: 350px;
  padding: 8px;
  background: #f9f9f9;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.course-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}
.course-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.course-name {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-size: 1.5em;
  font-weight: 600;
}
.courses-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 32px 64px 32px;
  align-items: center;
  justify-content: center;
}
.courses-description {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 50%;
}
.button-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  object-position: 50% 30%;
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

.courses-description .title,
.courses-title {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-size: 2em;
  font-weight: 600;
}
button {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-weight: 600;
  padding: 8px 16px;
  border: 1px solid black;
  background: white;
}
button:hover {
  background: black;
  color: white;
  cursor: pointer;
}
.price {
  font-weight: 600;
}

@media (max-width: 768px) {
  .hero-container {
    height: 50vh;
  }
  .courses-description {
    width: 100%;
  }
  .courses {
    width: 100%;
  }
  .course-item-container {
    width: 100%;
  }
  .hero h1 {
    font-size: 2em;
  }
  .courses-description .title {
    font-size: 1.5em;
  }
}
</style>
