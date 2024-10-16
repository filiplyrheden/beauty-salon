<template>
  <div class="order-container">
    <h1>Orders</h1>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- Edit OrderForm -->
    <div v-if="isEditing" class="form-container" ref="formContainer">
      <h2>Ändra Order</h2>
      <form @submit.prevent="updateOrder()" enctype="multipart/form-data">
        <div class="form-group">
          <label for="name">Order id:</label>

          <input type="text" disabled v-model="form.order_id" />
        </div>
        <!-- status -->
        <div class="form-group">
          <label for="name">Order Status:</label>

          <select name="status" id="status" v-model="form.order_status">
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <!-- Buttons -->
        <div class="button-group">
          <button type="submit">Ändra Order</button>
          <button type="button" @click="cancelEdit">Avbryt</button>
        </div>
      </form>
    </div>

    <!-- Order List -->
    <div class="list-container">
      <h2>Alla Ordrar</h2>
      <table>
        <thead>
          <tr>
            <th class="w-7">Order ID</th>
            <th class="w-7">AnvändarID</th>
            <th>Address</th>
            <th class="w-7">Order Status</th>
            <th>Produkter</th>
            <th class="w-7">Kostnad</th>
            <th class="w-10">Datum</th>
            <th class="w-10">Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.order_id">
            <td>{{ order.order_id }}</td>
            <td>{{ order.user_id }}</td>
            <td>
              {{ order.user.first_name + " " + order.user.last_name }}

              <br />
              {{ order.user.address_line1 || "Ingen Address Angiven" }}

              <template v-if="order.user.address_line2">
                <br />
                {{ order.user.address_line2 }}
              </template>

              <br />
              {{
                order.user.postal_code && order.user.city
                  ? `${order.user.postal_code} ${order.user.city}`
                  : "Ingen postkod angiven"
              }}

              <br />
              {{ order.user.country || "Inget land Angivet" }}
              <br />
              {{ order.user.phone || "Inget telefonnummer angivet" }}
            </td>

            <td>{{ order.order_status }}</td>
            <td>
              <div>
                <div
                  v-for="product in order.products"
                  :key="product.product_id"
                >
                  <strong>{{ product.product_name }}</strong>
                  <br />
                  Antal: {{ product.quantity }}
                  <br />
                  Pris:
                  {{ product.unit_price.toFixed(2) }}
                  <br />
                  Total:
                  {{ product.unit_price * product.quantity }}
                </div>
              </div>
            </td>
            <td>{{ order.total_amount }}</td>
            <td>{{ formatDate(order.order_date) }}</td>
            <td>
              <button @click="editOrder(order)">Edit</button>
              <button @click="deleteOrder(order.order_id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "OrderView",
  data() {
    return {
      orders: [],
      form: {
        order_id: null,
        order_status: "",
      },
      isEditing: false,
      isLoading: false, // For loading indicator
    };
  },
  computed: {
    API_BASE_URL() {
      const url = process.env.VUE_APP_API_BASE_URL || "http://localhost:3000";
      return url;
    },
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    /**
     * Fetch all categories from the backend.
     */
    async fetchOrders() {
      this.isLoading = true;
      try {
        const response = await axios.get(`${this.API_BASE_URL}/orders`);
        this.orders = response.data.map((order) => ({
          ...order,
        }));
      } catch (error) {
        console.error(
          "Error fetching categories:",
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
    async updateOrder() {
      try {
        this.isLoading = true;

        const response = await axios.put(
          `${this.API_BASE_URL}/orders/${this.form.order_id}`,
          {
            order_status: this.form.order_status,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Find the index of the order to update
        const index = this.orders.findIndex(
          (order) => order.order_id === this.form.order_id
        );

        if (index !== -1) {
          // Merge the updated fields into the existing order object
          this.orders[index] = {
            ...this.orders[index], // Preserve existing fields
            ...response.data, // Overwrite with updated fields
          };
        }

        this.resetForm();
        this.isEditing = false;
        Swal.fire("Success", "Order updated successfully!", "success");
      } catch (error) {
        console.error("Error updating order:", error.response || error.message);
        Swal.fire(
          "Error",
          "Failed to update order. Please check your input and try again.",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Prepare to edit a order by pre-filling the form.
     */
    editOrder(order) {
      this.isEditing = true;
      this.form.order_status = order.order_status;
      this.form.order_id = order.order_id;
      this.$nextTick(() => {
        this.$refs.formContainer.scrollIntoView({ behavior: "smooth" });
      });
    },
    /**
     * Delete an order .
     */
    async deleteOrder(order_id) {
      const result = await Swal.fire({
        title: "Are you sure?",
        html: "Vill du verkligen ta bort den här Ordern? Detta kan inte ångras!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      // Check if the user confirmed the action
      if (!result.isConfirmed) return;

      try {
        this.isLoading = true;
        await axios.delete(`${this.API_BASE_URL}/orders/${order_id}`);
        this.orders = this.orders.filter(
          (order) => order.order_id !== order_id
        );
        Swal.fire("Deleted!", "Order deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting Order:", error.response || error.message);
        Swal.fire(
          "Error",
          "Failed to delete Order. Please try again later.",
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
        order_id: "",
        order_status: "",
      };
    },

    /**
     * Cancel editing and reset the form.
     */
    cancelEdit() {
      this.resetForm();
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
      return new Date(datetime).toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style scoped>
.order-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
.w-7 {
  width: 7%;
}
.w-10 {
  width: 15%;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
  .form-group select {
    width: 100%;
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
    content: "Order ID";
  }
  td:nth-of-type(2)::before {
    content: "AnvändarID";
  }
  td:nth-of-type(3)::before {
    content: "Address";
  }
  td:nth-of-type(4)::before {
    content: "Status";
  }
  td:nth-of-type(5)::before {
    content: "Produkter";
  }
  td:nth-of-type(6)::before {
    content: "Total";
  }
  td:nth-of-type(7)::before {
    content: "Datum";
  }
  td:nth-of-type(8)::before {
    content: "Åtgärder";
  }
}
</style>
