import "./assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import utils from "./utils/utils";

const app = createApp(App);

app.use(router);
app.config.globalProperties.$utils = utils;

app.mount("#app");
