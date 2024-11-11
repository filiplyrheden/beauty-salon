<template>
  <div>
    <div class="hero-container">
      <div class="hero">
        <img class="hero-image" src="../../assets/events.png" alt="" />
        <div class="hero-overlay"></div>
        <h1>EVENT</h1>
      </div>
    </div>
    <div class="events-and-courses-container">
      <div class="events-section">
        <div class="events-description">
          <div class="title">
            Låt Shahad sätta guldkant på din speciella dag!
          </div>
          <div class="description">
            Oavsett om det är en möhippa, födelsedagsfirande eller en kreativ
            sminkworkshop, erbjuder Shahad skräddarsydda skönhetsupplevelser som
            gör ditt event minnesvärt. Perfekt för grupper i alla storlekar –
            varje session anpassas efter dina önskemål med sminktips, tutorials
            och en härlig atmosfär som alla kommer att uppskatta. Skapa
            oförglömliga minnen och se fantastiska ut med hjälp av en
            professionell som vet hur man balanserar stil, kreativitet och
            glädje!
          </div>
          <router-link to="/om-mig">
            <button>KONTAKTA SHAHAD FÖR ETT SKRÄDDARSYTT EVENT</button>
          </router-link>
        </div>
        <div class="events">
          <h2 class="events-title">KOMMANDE EVENTS</h2>
          <div v-if="isLoading" class="loading">Loading...</div>

          <!-- Show message if no events are available -->
          <div v-else-if="events.length === 0" class="no-events">
            Det finns inga publika events just nu, kontakta mig för att skapa
            ditt egna skräddarsydda event.
          </div>

          <!-- List of events if they are available -->
          <div v-else class="all-events">
            <div
              v-for="event in events"
              :key="event.event_id"
              class="event-item-container"
            >
              <div class="event-item">
                <img
                  src="../../assets/events.png"
                  alt="Event bild"
                  class="event-image"
                />
                <div class="event-name">{{ event.name }}</div>
                <div class="event-description">
                  {{ formatDate(event.schedule) }}
                </div>
                <div class="event-description">{{ event.description }}</div>
              </div>
              <!-- todo: change to :src="event.image_url" to reflect the images of each event-->
              <div class="buttons">
                <a :href="event.booking_link"
                  ><button class="booking-link">BOKA</button></a
                >
                <div class="price">{{ event.price }} kr</div>
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
      events: [],
      isLoading: false,
      isPopupVisible: false, // For popup visibility
    };
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await axiosInstance.get(`/events`);
        this.events = response.data.map((event) => ({
          ...event,
        }));
      } catch (error) {
        console.error(
          "Error fetching courses:",
          error.response || error.message
        );
        Swal.fire(
          "Fel",
          "Fel vid hämtning av Event: Misslyckades med att hämta Event. Försök igen senare",
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
    this.fetchEvents();
  },
};
</script>
<style scoped>
.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-weight: 500;
}
.hero-container {
  width: 100%;
  height: 60vh;
}
.events-and-courses-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
}
.events {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 32px;
}
.all-events {
  display: flex;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
}
.event-item-container {
  gap: 16px;
  width: calc(50% - 8px);
  min-height: 350px;
  padding: 8px;
  background: #f9f9f9;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.event-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.event-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.event-name {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-size: 1.5em;
  font-weight: 600;
}
.events-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 32px 64px 32px;
  align-items: center;
  justify-content: center;
}
.events-description {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 50%;
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

.events-description .title,
.events-title {
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
  width: 100%;
}
button:hover {
  background: black;
  color: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .hero-container {
    height: 50vh;
  }
  .events-description {
    width: 100%;
  }
  .events {
    width: 100%;
  }
  .event-item-container {
    width: 100%;
  }
  .hero h1 {
    font-size: 2em;
  }
  .event-description .title {
    font-size: 1.5em;
  }
}
</style>
