<template>
  <div id="app">
    <HeaderNav />
    <router-view></router-view>
    <!-- This will display the routed components -->
    <PopupComponent
      v-if="isPopupVisible"
      :isVisible="isPopupVisible"
      @close="closePopup"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderNav from "./components/HeaderNavigation.vue";
import PopupComponent from './components/LogoutPopup.vue';

export default {
  name: "App",
  components: {
    HeaderNav,
    PopupComponent,
  },
  computed: {
    ...mapState(['isPopupVisible']),
  },
  methods: {
    closePopup() {
      this.$store.dispatch('closePopup');
    },
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
