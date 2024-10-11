<template>
    <div class="event-list-container">
      <h2 class="event-list-title">Event List</h2>
      <ul class="event-list">
        <li v-for="event in items" :key="event.event_id" class="event-item">
          <table class="event-details">
            <tr>
              <th>Name:</th>
              <td>{{ event.name }}</td>
            </tr>
            <tr>
              <th>ID:</th>
              <td>{{ event.event_id }}</td>
            </tr>
            <tr>
              <th>Description:</th>
              <td>{{ event.description }}</td>
            </tr>
            <tr>
              <th>Price:</th>
              <td>${{ event.price }}</td>
            </tr>
            <tr>
              <th>Image:</th>
              <td>
                <img :src="getImageUrl(event.image_url)" alt="Event Image" class="event-image" />
              </td>
            </tr>
            <tr>
              <th>Booking Link:</th>
              <td>
                <a :href="event.booking_link" target="_blank">{{ event.booking_link }}</a>
              </td>
            </tr>
            <tr>
              <th>Created At:</th>
              <td>{{ event.created_at }}</td>
            </tr>
          </table>
          <div class="event-actions">
            <!-- Delete Button -->
            <button @click="deleteEvent(event.event_id)" class="delete-btn">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
  
            <!-- Edit Button -->
            <button @click="editEvent(event)" class="edit-btn">
              <font-awesome-icon :icon="['fas', 'edit']" />
            </button>
          </div>
          <br>
          <!-- Edit Form -->
          <div v-if="editingEvent && editingEvent.event_id === event.event_id" class="edit-form">
            <h3>Edit Event</h3>
            <label for="editName">Name:</label>
            <input v-model="editingEvent.name" id="editName" type="text" class="input-field" />
            <br />
            <label for="editDescription">Description:</label>
            <input v-model="editingEvent.description" id="editDescription" type="text" class="input-field" />
            <br />
            <label for="editPrice">Price:</label>
            <input v-model="editingEvent.price" id="editPrice" type="number" class="input-field" />
            <br />
            <label for="editImage">New Image:</label>
            <input type="file" @change="onFileChange" id="editImage" accept="image/*" class="input-file" />
            <br />
            <label for="editBookingLink">Booking Link:</label>
            <input v-model="editingEvent.booking_link" id="editBookingLink" type="text" class="input-field" />
            <br />
            <button @click="saveEvent(editingEvent)" class="save-btn">Save Changes</button>
            <button @click="cancelEdit" class="cancel-btn">Cancel</button>
          </div>
  
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
      },
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
        const eventId = event.event_id;
        const formData = new FormData();
        formData.append('name', event.name);
        formData.append('description', event.description);
        formData.append('price', event.price);
        formData.append('booking_link', event.booking_link);
        if (this.selectedFile) {
          formData.append('image', this.selectedFile);
        }
  
        axios.put(`http://localhost:3000/admin/events/${eventId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          console.log("Event saved successfully:", response.data);
          alert(event.name + " saved successfully!");
          this.selectedFile = null;
        })
        .catch(error => {
          console.error("Error saving event:", error.response ? error.response.data : error.message);
        });
        this.editingEvent = null;
      },
      cancelEdit() {
        this.editingEvent = null;
        this.selectedFile = null;
      }
    },
    mounted() {
      console.log("Event items:", this.items);
    }
  };
  </script>
  
  <style scoped>
  .course-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .event-image{
    width: 100px;
  }

  li{
    list-style-type: none;
  }

  .event-actions{
    margin-top: 8px;
  }
  
  h1,
  h2 {
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
    background-color: #007bff;
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
  </style>
  