<template>
  <div id="app">
    <router-view></router-view>
    <!-- This will display the routed components -->
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
