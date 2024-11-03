import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBox,
  faCalendar,
  faStar,
  faGraduationCap,
  faSpa,
  faTags,
  faComments,
  faLayerGroup,
  faShoppingBag,
  faUser,
  faMagnifyingGlass,
  faLock,
  faTrash,
  faChevronUp,
  faChevronDown,
  faCheck,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { store } from "./store/store.js";

library.add(
  faChevronDown,
  faCheck,
  faTag,
  faChevronUp,
  faTrash,
  faBox,
  faUser,
  faCalendar,
  faStar,
  faGraduationCap,
  faSpa,
  faTags,
  faComments,
  faLayerGroup,
  faShoppingBag,
  faUser,
  faLock,
  faMagnifyingGlass
);
createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(store)
  .mount("#app");
