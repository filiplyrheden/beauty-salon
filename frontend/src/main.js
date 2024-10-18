
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBox, faCalendar, faStar, faGraduationCap, faSpa, faTags, faComments, faLayerGroup, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { store } from "./store/store.js";

library.add(faBox, faCalendar, faStar, faGraduationCap, faSpa, faTags, faComments, faLayerGroup, faShoppingBag);


createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(store)
  .mount("#app");
