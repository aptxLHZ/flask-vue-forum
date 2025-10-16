// frontend/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
// 导入我们新建的视图组件
import RegisterView from "../views/Register.vue";
import LoginView from "../views/Login.vue";
import HomeView from "../views/Home.vue";
import PostDetailView from "../views/PostDetail.vue";
import CreatePostView from "../views/CreatePost.vue";

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
  {
    path: "/create-post",
    name: "createPost",
    component: CreatePostView,
    meta: { requiresAuth: true }, // 添加 meta 字段
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// --- 全局前置守卫 ---
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 如果路由需要认证
    if (!store.getters.isLoggedIn) {
      // 但用户未登录
      next({ name: "login" }); // 跳转到登录页
    } else {
      next(); // 已登录，放行
    }
  } else {
    next(); // 不需要认证，直接放行
  }
});

export default router;
