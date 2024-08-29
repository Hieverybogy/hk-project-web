import "./assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 全局组件
import { setupGlobCom } from '@/components'

const app = createApp(App);

app.use(router);
app.use(ElementPlus);

setupGlobCom(app)

app.mount("#app");
