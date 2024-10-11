<template>
    <div>
      <h2>Add New Event</h2>
      <form @submit.prevent="saveEvent">
        <div>
          <label for="eventName">Event Name:</label>
          <input 
            type="text" 
            id="eventName" 
            v-model="eventName" 
            required
          />
        </div>
  
        <div>
          <label for="description">Description:</label>
          <textarea 
            id="description" 
            v-model="description" 
            required
          ></textarea>
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
          <input 
            type="text" 
            id="bookingLink" 
            v-model="bookingLink"
          />
        </div>
  
        <button type="submit">Add Event</button>
      </form>
  
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
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
          const response = await axios.post("http://localhost:3000/admin/events", formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Set content type for file upload
            },
          });
          console.log("Response:", response);
          this.message = "Event added successfully! Event ID: " + response.data.event_id; // Ensure correct property access
          this.resetForm(); // Clear form fields after successful submission
        } catch (error) {
          console.error("Error adding event:", error);
          // Check if error response exists
          if (error.response && error.response.data) {
            this.message = "Error adding event: " + error.response.data.error; // Access error message safely
          } else {
            this.message = "Error adding event: " + error.message || "Internal Server Error"; // Fallback error message
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
    }
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  