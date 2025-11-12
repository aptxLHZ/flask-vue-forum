// frontend/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

// --- 确保所有需要的视图组件都被导入 ---
import HomeView from "../views/Home.vue";
import PostDetailView from "../views/PostDetail.vue";
import RegisterView from "../views/Register.vue";
import LoginView from "../views/Login.vue";
import CreatePostView from "../views/CreatePost.vue"; // <<<--- 确保这一行存在！

const routes = [
  {
    path: "/",
    name: "home",
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
  // --- 核心修复点：添加这条路由规则！ ---
  {
    path: "/create-post",
    name: "createPost", // <<<--- Vue Router 现在认识 'createPost' 这个名字了
    component: CreatePostView,
    meta: { requiresAuth: true }, // 别忘了权限控制
  },
  // ------------------------------------
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// --- 全局前置守卫 (确保它也存在) ---
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
