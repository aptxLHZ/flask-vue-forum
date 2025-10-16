import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios"; // 导入 axios

// --- 在这里添加初始化逻辑 ---
// 检查 localStorage 中是否存在 token
const token = localStorage.getItem("token");
if (token) {
  // 如果存在，就设置到 axios 的默认请求头中
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
// 在 main.js 或 store 中添加
if (token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const isExpired = Date.now() >= payload.exp * 1000;
  if (isExpired) {
    localStorage.removeItem("token");
    // 跳转到登录页
  }
}
createApp(App).use(store).use(router).mount("#app");
