import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layout/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home/index",
    },
    {
      path: "/home",
      name: "layout",
      component: Layout,
      children: [
        {
          path: "/home/index",
          name: "home",
          meta: {},
          component: () => import("../views/index/index.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  // 修改标题
  to.meta.title && (document.title = to.meta.title as string);
  next();
});

export default router;
