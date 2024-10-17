
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrash, faSave, faTimes, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { store } from "./store/store.js";

library.add(faEdit, faTrash, faSave, faTimes, faExternalLinkAlt)


createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(store)
  .mount("#app");
