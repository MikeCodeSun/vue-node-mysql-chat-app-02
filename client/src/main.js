import { createApp } from "vue";
import App from "./App.vue";
import route from "./router/route";
import { createPinia } from "pinia";

import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();
app.use(route);
app.use(pinia);

app.mount("#app");
