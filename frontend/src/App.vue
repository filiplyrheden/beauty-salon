<template>
  <div id="app">
    <HeaderNav />
    <router-view></router-view>
    <!-- This will display the routed components -->
  </div>
</template>

<script>
import HeaderNav from "./components/HeaderNavigation.vue";

export default {
  name: "App",
  components: {
    HeaderNav,
  },
};
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
