import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserCircle, faEdit);



const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
