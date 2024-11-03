<template>
  <div>
    <div class="header">
      <router-link to="/admin" class="back"
        ><font-awesome-icon icon="chevron-left" /> Tillbaka</router-link
      >
      <h2>Add New Event</h2>
    </div>
    <form @submit.prevent="saveEvent">
      <div>
        <label for="eventName">Event Name:</label>
        <input type="text" id="eventName" v-model="eventName" required />
      </div>

      <div>
        <label for="description">Description:</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>

      <div>
        <label for="eventPrice">Price:</label>
        <input
          type="number"
          id="eventPrice"
          v-model="eventPrice"
          step="0.01"
          required
        />
      </div>

      <div>
        <label for="image">Image:</label>
        <input
          type="file"
          id="image"
          @change="onImageChange"
          accept="image/*"
          required
        />
      </div>

      <div>
        <label for="bookingLink">Booking Link:</label>
        <input type="text" id="bookingLink" v-model="bookingLink" />
      </div>

      <button type="submit">Add Event</button>
    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";

export default {
  data() {
    return {
      eventName: "",
      description: "",
      eventPrice: "",
      imageFile: null, // Store the image file
      bookingLink: "",
      message: "", // For success or error messages
    };
  },
  methods: {
    // Handle image file change
    onImageChange(event) {
      this.imageFile = event.target.files[0]; // Store the selected image file
    },

    // Save new event
    async saveEvent() {
      const formData = new FormData();
      formData.append("name", this.eventName);
      formData.append("description", this.description);
      formData.append("price", parseFloat(this.eventPrice));
      formData.append("image", this.imageFile); // Add the image file to form data
      formData.append("booking_link", this.bookingLink);

      try {
        const response = await axiosInstance.post("/admin/events", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        });
        console.log("Response:", response);
        this.message =
          "Event added successfully! Event ID: " + response.data.event_id; // Ensure correct property access
        this.resetForm(); // Clear form fields after successful submission
      } catch (error) {
        console.error("Error adding event:", error);
        // Check if error response exists
        if (error.response && error.response.data) {
          this.message = "Error adding event: " + error.response.data.error; // Access error message safely
        } else {
          this.message =
            "Error adding event: " + error.message || "Internal Server Error"; // Fallback error message
        }
      }
    },

    // Reset form fields
    resetForm() {
      this.eventName = "";
      this.description = "";
      this.eventPrice = "";
      this.imageFile = null; // Reset the image file
      this.bookingLink = "";
    },
  },
};
</script>

<style scoped>
/* General form layout */
form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Headings */
h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5em;
  color: #333;
}

/* Input fields and labels */
div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
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

/* Textarea styling */
textarea {
  height: 100px;
  resize: vertical;
}

/* File input */
input[type="file"] {
  padding: 5px;
}

/* Buttons */
button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  opacity: 0.9;
}

/* Success or error messages */
p {
  text-align: center;
  margin-top: 20px;
  font-size: 1.1rem;
  color: green;
}

p.error {
  color: red;
}

.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  flex-direction: column;
  padding-top: 32px;
}
.header h2 {
  margin-bottom: 32px;
}
.back {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translate(0%, -50%);
}
.header a {
  color: #007bff;
  font-size: 1em;
}
</style>
