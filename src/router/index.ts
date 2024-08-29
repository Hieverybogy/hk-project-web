import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/layout/index.vue";

export const constantRouterMap = [
  {
    path: "/home/index",
    name: "home",
    meta: {
      title: '首页',
    },
    component: () => import("../views/index/index.vue"),
  },
  {
    path: "/aaa",
    name: "aaa",
    meta: {
      title: 'three.js',
    },
    component: () => import("../views/index/aaa.vue"),
  }, 
  {
    path: "/signaturePad",
    name: "signaturePad",
    meta: {
      title: '生成签名图片',
    },
    component: () => import("../views/signaturePad/index.vue"),
  },
  {
    path: "/qrCode",
    name: "qrCode",
    meta: {
      title: '二维码',
    },
    component: () => import("../views/qrCode/index.vue"),
  },
  {
    path: "/fileList",
    name: "fileList",
    meta: {
      title: '文件上传列表',
    },
    component: () => import("../views/fileList/index.vue"),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home/index",
    },
    {
      path: '/layout',
      name: "layout",
      component: Layout,
      children: constantRouterMap
    }
  ],
});

router.beforeEach((to, from, next) => {
  // 修改标题
  to.meta.title && (document.title = to.meta.title as string);
  next();
});

export default router;
