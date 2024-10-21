<template>
  <div>
    <h1>Thanks for your order!</h1>
    <p>
      We appreciate your business! If you have any questions, please email
      <a :href="emailLink">orders@example.com</a>.
    </p>
  </div>
</template>

<script>
export default {
  name: "SuccessPage",
  data() {
    return {
      emailLink: "mailto:orders@example.com",
    };
  },
};
</script>

<style scoped>
/* Add any styles here */
h1 {
  color: #333;
}
p {
  font-size: 16px;
}
a {
  color: #007bff;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
