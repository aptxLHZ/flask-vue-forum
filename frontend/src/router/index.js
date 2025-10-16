// frontend/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
// 导入我们新建的视图组件
import RegisterView from "../views/Register.vue";
import LoginView from "../views/Login.vue";
import HomeView from "../views/Home.vue";
import PostDetailView from "../views/PostDetail.vue";

const routes = [
  {
    path: "/",
    name: "home", //将根路径命名为home
    component: HomeView,
  },
  {
    path: "/post/:id",
    name: "postDetail",
    component: PostDetailView,
    props: true,
  },
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
