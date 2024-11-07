<template>
  <div class="contact-container" id="contact">
    <div class="contact-header">
      <h2>KONTAKT FORMULÄR</h2>
      <p>Skicka ett meddelande så återkommer jag så snart jag kan.</p>
    </div>
    <div class="contact-form">
      <form @submit.prevent="sendEmail">
        <div class="form-group">
          <label for="name">Namn</label>
          <input
            v-model="name"
            required
            type="text"
            id="name"
            name="name"
            placeholder="Förnamn Efternamn"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            required
            v-model="email"
            type="text"
            id="name"
            name="name"
            placeholder="exempel@email.com"
          />
        </div>
        <div class="form-group">
          <label for="message">Meddelande</label>
          <textarea
            v-model="message"
            required
            class="message"
            id="message"
            name="message"
            placeholder="Skriv ditt meddelande"
          ></textarea>
        </div>
        <button type="submit">SKICKA</button>
      </form>
    </div>
  </div>
</template>
<script>
import axiosInstance from "@/services/axiosConfig";
import Swal from "sweetalert2";

export default {
  name: "ContactForm",
  data() {
    return {
      email: "",
      name: "",
      message: "",
    };
  },
  methods: {
    async sendEmail() {
      try {
        const response = await axiosInstance.post("/contactform", {
          email: this.email,
          name: this.name,
          message: this.message,
        });
        console.log(response);
        this.resetEmailForm();
        Swal.fire({
          icon: "success",
          title: "Tack!",
          text: "Ditt meddelande har skickats!",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Något gick fel när du skickade mailet!",
        });
      }
    },
    resetEmailForm() {
      this.email = "";
      this.name = "";
      this.message = "";
    },
  },
};
</script>
<style scoped>
.contact-container {
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 32px 32px 64px 32px;
  gap: 16px;
}
h2 {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-size: 2em;
  font-weight: 600;
}
.contact-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
input {
  padding: 8px;
}
label {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 4%;
  font-size: 1em;
}
.message {
  min-height: 200px;
}
textarea {
  padding: 8px;
}
button {
  font-family: "Playfair Display", serif !important;
  padding: 8px;
  color: white;
  background-color: black;
  border: 1px solid black;
  cursor: pointer;
  font-weight: 600;
}
button:hover {
  background-color: white;
  color: black;
}
form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
