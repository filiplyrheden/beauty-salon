<template>
  <div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <div class="header">
      <router-link to="/admin" class="back"
        ><font-awesome-icon icon="chevron-left" /> Tillbaka</router-link
      >
      <h2>Lägg Till Event</h2>
    </div>
    <form @submit.prevent="saveEvent" enctype="multipart/form-data">
      <div>
        <label for="eventName">Event Namn:</label>
        <input
          type="text"
          id="eventName"
          v-model="eventName"
          required
          placeholder="Smink event, Hårstyling event, etc."
        />
      </div>

      <div>
        <label for="description">Beskrivning:</label>
        <textarea
          id="description"
          v-model="description"
          required
          placeholder="Skriv en kort beskrivning av eventet"
        ></textarea>
      </div>

      <div>
        <label for="eventPrice">Pris:</label>
        <input
          type="number"
          id="eventPrice"
          v-model="eventPrice"
          step="1.00"
          placeholder="0"
          required
        />
      </div>

      <div>
        <label for="schedule">Tid:</label>
        <input
          v-model="schedule"
          id="schedule"
          type="datetime-local"
          required
          ref="scheduleInput"
        />
      </div>

      <div>
        <label for="image">Bild:</label>
        <input
          type="file"
          id="image"
          @change="onImageChange"
          accept="image/*"
          required
        />
      </div>

      <div>
        <label for="bookingLink">Bokningslänk:</label>
        <input
          type="text"
          id="bookingLink"
          v-model="bookingLink"
          placeholder="http://www.bokadirekt.se"
        />
      </div>

      <button type="submit">Lägg till</button>
    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      eventName: "",
      description: "",
      eventPrice: "",
      imageFile: null,
      bookingLink: "",
      message: "",
      schedule: "",
      isLoading: false,
    };
  },
  mounted() {
    if (!this.schedule) {
      const now = new Date();
      const localISOTime =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        "T" +
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");

      this.schedule = localISOTime;
    }
  },
  methods: {
    onImageChange(event) {
      this.imageFile = event.target.files[0];
    },
    async saveEvent() {
      const formData = new FormData();
      formData.append("name", this.eventName);
      formData.append("description", this.description);
      formData.append("price", parseFloat(this.eventPrice));
      formData.append("eventImage", this.imageFile);
      formData.append("booking_link", this.bookingLink);
      formData.append("schedule", this.schedule);

      try {
        this.isLoading = true;
        const response = await axiosInstance.post("/admin/events", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire(
          "Event skapat!",
          `Eventet "${this.eventName}" har skapats.`,
          "success"
        );
        this.$emit("event-created", response.data.event);
        this.resetForm();
        this.isLoading = false;
      } catch (error) {
        console.error(
          "Error adding category:",
          error.response || error.message
        );

        // Get all error messages from the response
        const errorMessages =
          error.response?.data?.errors?.map((e) => e.msg).join("<br>") ||
          "Okänt fel uppstod. <br> Kolla så att du bara sätter in (jpeg, jpg, png, gif) som bilder.";

        Swal.fire(
          "Error",
          `Event kunde inte läggas till. Kolla vad du har skrivit in och försök igen! <br> ${errorMessages}`,
          "error"
        );
        this.isLoading = false;
      }
    },
    resetForm() {
      this.eventName = "";
      this.description = "";
      this.eventPrice = "";
      this.imageFile = null;
      this.bookingLink = "";
      this.schedule = "";
    },
  },
};
</script>

<style scoped>
form {
  max-width: 100%;
  width: 90%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 1.5em;
  color: #333;
  margin-bottom: 20px;
}

div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
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

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
}
#schedule,
#image {
  background: white !important;
  color: black !important;
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
textarea {
  height: 100px;
  resize: vertical;
}

input[type="file"] {
  padding: 5px;
}

button[type="submit"] {
  background-color: #202020;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
  border-radius: 4px;
  font-family: "Playfair Display", serif;
}

button[type="submit"]:hover {
  background-color: white;
  color: #202020;
  border: 1px solid #202020;
}

p {
  text-align: center;
  font-size: 1.1rem;
  color: green;
  margin-top: 20px;
}

p.error {
  color: red;
}

.header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
}
.header h2 {
  margin-bottom: 32px;
}
.back {
  text-decoration: none;
  color: black;
  font-size: 14px;
  border: 1px solid black;
  padding: 8px 16px;
  font-family: "Playfair Display", serif;
  position: absolute;
  top: 10px;
  left: 5%;
}
#schedule {
  width: 100%;
}
.back:hover {
  color: white;
  background-color: #202020;
}

@media (max-width: 600px) {
  input,
  select,
  textarea {
    font-size: 16px;
  }
  form {
    padding: 15px;
  }

  h2 {
    font-size: 1.3em;
    margin-bottom: 16px;
    margin-top: 24px;
  }

  label {
    font-size: 0.9rem;
  }

  button[type="submit"] {
    font-size: 1rem;
    padding: 8px 12px;
  }

  .back {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
