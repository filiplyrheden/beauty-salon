<template>
    <div>
      <h2>Event List</h2>
      <ul>
        <li v-for="event in items" :key="event.event_id">
          <strong>Name:</strong> {{ event.name }} <br />
          <strong>ID:</strong> {{ event.event_id }} <br />
          <strong>Description:</strong> {{ event.description }} <br />
          <strong>Price:</strong> ${{ event.price }} <br />
          <strong>Image:</strong>
          <img :src="getImageUrl(event.image_url)" alt="Event Image" width="100" />
          <br />
          <strong>Booking Link:</strong>
          <a :href="event.booking_link" target="_blank">{{ event.booking_link }}</a>
          <br />
          <strong>Created At:</strong> {{ event.created_at }} <br />
  
          <!-- Delete Button -->
          <button @click="deleteEvent(event.event_id)">
            <font-awesome-icon :icon="['fas', 'trash']" />
          </button>
  
          <!-- Edit Button -->
          <br />
          <button @click="editEvent(event)">
            <font-awesome-icon :icon="['fas', 'edit']" />
          </button>
  
          <!-- Edit Form -->
          <div v-if="editingEvent && editingEvent.event_id === event.event_id">
            <h3>Edit Event</h3>
            <label for="editName">Name:</label>
            <input v-model="editingEvent.name" id="editName" type="text" />
            <br />
            <label for="editDescription">Description:</label>
            <input v-model="editingEvent.description" id="editDescription" type="text" />
            <br />
            <label for="editPrice">Price:</label>
            <input v-model="editingEvent.price" id="editPrice" type="number" />
            <br />
            <label for="editImage">New Image:</label>
            <input type="file" @change="onFileChange" id="editImage" accept="image/*" />
            <br />
            <label for="editBookingLink">Booking Link:</label>
            <input v-model="editingEvent.booking_link" id="editBookingLink" type="text" />
            <br />
            <button @click="saveEvent(editingEvent)">Save Changes</button>
            <button @click="cancelEdit">Cancel</button>
          </div>
  
          <hr />
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "EventList",
    props: {
      items: {
        type: Array,
        required: true,
      }
    },
    data() {
      return {
        editingEvent: null,
        selectedFile: null, // To store the selected file
      };
    },
    methods: {
        getImageUrl(imageName) {
      return `http://localhost:3000${imageName}`;
      },
      deleteEvent(eventId) {
        console.log("Deleting event with ID:", eventId);
        axios.delete(`http://localhost:3000/admin/events/${eventId}`)
          .then(response => {
            console.log("Event deleted successfully:", response.data);
            this.$emit('event-deleted', eventId);
          })
          .catch(error => {
            console.error("Error deleting event:", error.response ? error.response.data : error.message);
          });
      },
      editEvent(event) {
        this.editingEvent = { ...event };
      },
      onFileChange(event) {
        this.selectedFile = event.target.files[0]; // Store the selected file
      },
      saveEvent(event) {
        console.log("Saving event:", event);
        const eventId = event.event_id; // Assuming event_id is the correct property
        const formData = new FormData();
        formData.append('name', event.name);
        formData.append('description', event.description);
        formData.append('price', event.price);
        formData.append('booking_link', event.booking_link);
        if (this.selectedFile) {
          formData.append('image', this.selectedFile); // Append the selected file
        }
  
        axios.put(`http://localhost:3000/admin/events/${eventId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          console.log("Event saved successfully:", response.data);
          alert(event.name + " saved successfully!");
          this.selectedFile = null; // Reset selected file after saving
        })
        .catch(error => {
          console.error("Error saving event:", error.response ? error.response.data : error.message);
        });
        this.editingEvent = null;
      },
      cancelEdit() {
        this.editingEvent = null;
        this.selectedFile = null; // Reset selected file when canceling edit
      }
    },
    mounted() {
      console.log("Event items:", this.items);
    }
  };
  </script>
  