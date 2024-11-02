<template>
  <div class="event-list-container">
    <h2 class="event-list-title">Event List</h2>
    <ul class="event-list">
      <li v-for="event in items" :key="event.event_id" class="event-item">
        <!-- Event Header -->
        <div class="event-header">
          <h3 class="event-name">{{ event.name }}</h3>
          <div class="event-actions">
            <button @click="editEvent(event)" class="action-btn edit-btn">
              <font-awesome-icon :icon="['fas', 'edit']" />
            </button>
            <button
              @click="deleteEvent(event.event_id)"
              class="action-btn delete-btn"
            >
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </div>
        </div>

        <!-- Event Content -->
        <div class="event-content">
          <div class="event-details">
            <div class="detail-group">
              <label>Description:</label>
              <p>{{ event.description }}</p>
            </div>
            <div class="detail-group">
              <label>Price:</label>
              <p>${{ event.price }}</p>
            </div>
            <div class="detail-group">
              <label>Created At:</label>
              <p>{{ event.created_at }}</p>
            </div>
            <div class="detail-group">
              <label>Booking:</label>
              <a
                :href="event.booking_link"
                target="_blank"
                class="booking-link"
              >
                <font-awesome-icon :icon="['fas', 'external-link-alt']" />
                Booking link
              </a>
            </div>
          </div>
          <div class="event-image-container">
            <img
              :src="getImageUrl(event.image_url)"
              :alt="event.name"
              class="event-image"
            />
          </div>
        </div>

        <!-- Edit Form -->
        <div
          v-if="editingEvent && editingEvent.event_id === event.event_id"
          class="edit-form"
        >
          <h4 class="edit-form-title">Edit Event</h4>
          <div class="form-group">
            <label for="editName">Name:</label>
            <input v-model="editingEvent.name" id="editName" type="text" />
          </div>
          <div class="form-group">
            <label for="editDescription">Description:</label>
            <input
              v-model="editingEvent.description"
              id="editDescription"
              type="text"
            />
          </div>
          <div class="form-group">
            <label for="editPrice">Price:</label>
            <input v-model="editingEvent.price" id="editPrice" type="number" />
          </div>
          <div class="form-group">
            <label for="editImage">New Image:</label>
            <input
              type="file"
              @change="onFileChange"
              id="editImage"
              accept="image/*"
            />
          </div>
          <div class="form-group">
            <label for="editBookingLink">Booking Link:</label>
            <input
              v-model="editingEvent.booking_link"
              id="editBookingLink"
              type="text"
            />
          </div>
          <div class="form-actions">
            <button @click="saveEvent(editingEvent)" class="save-btn">
              <font-awesome-icon :icon="['fas', 'save']" />
              Save Changes
            </button>
            <button @click="cancelEdit" class="cancel-btn">
              <font-awesome-icon :icon="['fas', 'times']" />
              Cancel
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";

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
      selectedFile: null,
    };
  },
  methods: {
    getImageUrl(imageName) {
      return `http://localhost:3000${imageName}`;
    },
    deleteEvent(eventId) {
      if (confirm("Are you sure you want to delete this event?")) {
        axiosInstance
          .delete(`/admin/events/${eventId}`)
          .then((response) => {
            console.log("Event deleted successfully:", response.data);
            this.$emit("event-deleted", eventId);
          })
          .catch((error) => {
            console.error("Error deleting event:", error);
          });
      }
    },
    editEvent(event) {
      this.editingEvent = { ...event };
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    saveEvent(event) {
      const formData = new FormData();
      formData.append("name", event.name);
      formData.append("description", event.description);
      formData.append("price", event.price);
      formData.append("booking_link", event.booking_link);

      if (this.selectedFile) {
        formData.append("image", this.selectedFile);
      }

      axiosInstance
        .put(`/admin/events/${event.event_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Event saved successfully:", response.data);
          alert(event.name + " saved successfully!");
          this.selectedFile = null;
          this.editingEvent = null;
        })
        .catch((error) => {
          console.error("Error saving event:", error);
        });
    },
    cancelEdit() {
      this.editingEvent = null;
      this.selectedFile = null;
    },
  },
};
</script>

<style scoped>
.event-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.event-list-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.event-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.event-item {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.event-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
}

.event-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-group label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.detail-group p {
  margin: 0;
  color: #2c3e50;
}

.event-image-container {
  position: relative;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-btn {
  background-color: #4a90e2;
  color: white;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.booking-link {
  color: #4a90e2;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.booking-link:hover {
  text-decoration: underline;
}

/* Edit Form Styles */
.edit-form {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.edit-form-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input[type="file"] {
  border: none;
  padding: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.save-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.save-btn {
  background-color: #2ecc71;
  color: white;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

/* Hover states */
.action-btn:hover,
.save-btn:hover,
.cancel-btn:hover {
  opacity: 0.9;
}

/* Responsive Design */
@media (max-width: 768px) {
  .event-content {
    grid-template-columns: 1fr;
  }

  .event-image-container {
    height: 250px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
