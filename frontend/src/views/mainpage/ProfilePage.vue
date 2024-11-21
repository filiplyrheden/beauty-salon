<template>
  <div class="profile-container">
    <!-- Loading Indicator -->
    <div>
      <h1>PROFIL</h1>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <a class="logout" v-else @click="handleLogout">Logga ut</a>

      <!-- User Profile -->
      <div v-if="!isEditing" class="form-container">
        <div class="profile-data">
          <p>
            <span class="label-tag">FÖRNAMN:</span>
            {{ form.firstName || "Ej Angivet" }}
          </p>
          <p>
            <span class="label-tag">EFTERNAMN:</span>
            {{ form.lastName || "Ej Angivet" }}
          </p>
          <p>
            <span class="label-tag">EMAIL:</span>
            {{ form.email || "Ej Angivet" }}
          </p>
          <p>
            <span class="label-tag">TELEFON:</span>
            {{ form.phone || "Ej Angivet" }}
          </p>
        </div>
        <button class="editButtonProfile" @click="editProfile">Redigera</button>
      </div>

      <!-- Edit User Profile Form -->
      <div v-else class="form-container" ref="formContainer">
        <h2>Redigera Profil</h2>
        <form @submit.prevent="updateProfile" enctype="multipart/form-data">
          <!-- First Name -->
          <div class="form-group">
            <label for="firstName">FÖRNAMN:</label>
            <input v-model="form.firstName" type="text" id="firstName" />
          </div>

          <!-- Last Name -->
          <div class="form-group">
            <label for="lastName">EFTERNAMN:</label>
            <input v-model="form.lastName" type="text" id="lastName" />
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email">EMAIL:</label>
            <input v-model="form.email" type="email" id="email" />
          </div>
          <div class="form-group">
            <label for="address">TELEFON:</label>
            <input v-model="form.phone" type="text" id="address" />
          </div>

          <!-- Buttons -->
          <div class="button-group">
            <button type="submit" @click="updateUser">Spara ändringar</button>
            <button type="button" @click="cancelEdit">Avbryt</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Order List -->
    <!-- Order List -->
    <div class="list-container">
      <h2>ALLA ORDRAR</h2>

      <!-- Display message if no orders are found -->
      <div v-if="orders.length === 0" class="no-orders">
        <p>Inga ordrar hittades.</p>
      </div>

      <!-- Table for displaying orders when available -->
      <table v-else>
        <thead>
          <tr>
            <th class="w-7">Order ID</th>
            <th>Adress</th>
            <th class="w-7">Order Status</th>
            <th>Produkter</th>
            <th class="w-7">Kostnad</th>
            <th class="w-10">Datum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.order_id">
            <td>{{ order.order_id }}</td>
            <td>
              {{ order.address_line1 || "Ingen Address Angiven" }}
              <template v-if="order.user?.address_line2">
                <br />
                {{ order.address_line2 }}
              </template>
              <br />
              {{
                order.postal_code && order.city
                  ? `${order.postal_code} ${order.city}`
                  : "Ingen postkod angiven"
              }}
              <br />
              {{ order.country || "Inget land Angivet" }}
            </td>

            <td>{{ order.order_status }}</td>
            <td>
              <div>
                <div
                  v-for="product in order.products"
                  :key="product.product_id"
                >
                  <strong>{{ product.product_name }} </strong>
                  <br />
                  {{ product.size }}
                  <br />
                  Antal: {{ product.quantity }}
                  <br />
                  Pris: {{ product.unit_price.toFixed(2) }}kr
                  <br />
                  Total: {{ product.unit_price * product.quantity }}kr
                </div>
              </div>
            </td>
            <td>{{ order.total_amount.toFixed(2) }}kr</td>
            <td>{{ formatDate(order.order_date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/services/axiosConfig";
import { mapState, mapMutations } from "vuex";
import Swal from "sweetalert2";

export default {
  name: "OrderView",
  data() {
    return {
      user: [],
      orders: [],
      form: {
        order_id: null,
        order_status: "",
      },
      isEditing: false,
      isLoading: false, // For loading indicator
    };
  },
  created() {
    this.fetchOrders(this.userId); // Pass the userId from the Vuex store
    this.fetchUser(this.userId); // Pass the userId from the Vuex store
  },
  computed: {
    ...mapState(["userId"]),
  },
  methods: {
    /**
     * Fetch all orders from the backend.
     */
    async fetchOrders(userId) {
      this.isLoading = true;
      try {
        // Use userId as a query parameter
        const response = await axiosInstance.get(
          `/ordersByUser/?userid=${userId}`
        );

        this.orders = response.data.map((order) => ({
          ...order,
        }));
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response || error.message
        );
        Swal.fire(
          "Error",
          "Failed to fetch orders. Please try again later.",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },
    async fetchUser(userId) {
      this.isLoading = true;
      try {
        // Fetch the user data based on userId
        const response = await axiosInstance.get(`/user/${userId}`);

        const user = response.data; // Assume API returns a single user object
        this.user = user;

        // Populate the form with fetched user data
        this.form.firstName = user.first_name;
        this.form.lastName = user.last_name;
        this.form.email = user.email;
      } catch (error) {
        console.error("Error fetching user:", error.response || error.message);
        Swal.fire(
          "Error",
          "Failed to fetch user. Please try again later.",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },
    async updateUser() {
      try {
        this.isLoading = true;

        // Send the data as JSON
        const response = await axiosInstance.put(`/user/${this.userId}`, {
          first_name: this.form.firstName,
          last_name: this.form.lastName,
          phone: this.form.phone,
          email: this.form.email,
        });

        this.user = { ...response.data };

        this.resetForm();
        this.isEditing = false;
        Swal.fire("Success", "User updated successfully!", "success");
      } catch (error) {
        console.error(
          "Error updating category:",
          error.response || error.message
        );
        Swal.fire(
          "Error",
          "Failed to update User. Please check your input and try again.",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * Reset the form fields
     */
    resetForm() {
      this.form = {
        phone: this.user.phone,
        email: this.user.email,
        firstName: this.user.first_name,
        lastName: this.user.last_name,
      };
    },

    editProfile() {
      this.isEditing = true;
      this.form.phone = this.user.phone;
      this.form.email = this.user.email;
      this.form.firstName = this.user.first_name;
      this.form.lastName = this.user.last_name;
    },
    /**
     * Cancel editing and reset the form.
     */
    cancelEdit() {
      this.isEditing = false;
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
      return new Date(datetime).toLocaleDateString("sv-SE", options);
    },
    ...mapMutations(["logout"]), // Map the logout mutation
    handleLogout() {
      this.logout();
      this.$router.push("/"); // Redirect to home
    },
    checkAuthentication() {
      this.$store.dispatch("checkAuth");
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

h1,
h2 {
  font-family: "Playfair Display", serif;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}
.profile-data {
  display: flex;
  gap: 8px;
  flex-direction: column;
}
.label-tag,
label {
  font-family: "Playfair Display", serif;
  font-weight: 600;
  margin-right: 6px;
}
.editButtonProfile {
  margin-top: 32px;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  padding: 8px 16px;
  border: 1px solid black;
  cursor: pointer;
  background-color: white;
}
.editButtonProfile:hover {
  background-color: black;
  color: white;
}
.logout {
  position: absolute;
  top: 32px;
  left: 22px;
  text-decoration: underline;
  cursor: pointer;
}

.form-container,
.list-container {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid black;
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
  border: 1px solid black;
}

.button-group {
  display: flex;
  justify-content: flex-start;
}

.button-group button {
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
.form-group select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group button[type="submit"] {
  background-color: #28a745;
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

tr:nth-child(2n) {
  background-color: #f8f8f8; /* Light gray background for every second td */
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
    content: "Order ID";
  }
  td:nth-of-type(2)::before {
    content: "Address";
  }
  td:nth-of-type(3)::before {
    content: "Status";
  }
  td:nth-of-type(4)::before {
    content: "Produkter";
  }
  td:nth-of-type(5)::before {
    content: "Total";
  }
  td:nth-of-type(6)::before {
    content: "Datum";
  }
}
</style>
