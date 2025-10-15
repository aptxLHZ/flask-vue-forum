// frontend/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
// 导入我们新建的视图组件
import RegisterView from "../views/Register.vue";
import LoginView from "../views/Login.vue";

const routes = [
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  // 我们可以加一个根路径重定向
  {
    path: "/",
    redirect: "/login", // 暂时先让根路径跳转到登录页
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
