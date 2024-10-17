import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { store } from "./store/store.js";

/* import specific icons */
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

library.add(faTrash, faEdit);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(store)
  .mount("#app");
