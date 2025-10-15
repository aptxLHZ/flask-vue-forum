// frontend/src/store/index.js
import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    // 存放状态的地方 (类似组件的 data)
    token: localStorage.getItem("token") || "",
    user: {},
  },
  mutations: {
    // 同步修改 state 的唯一方法 (类似组件的 methods，但必须是同步的)
    AUTH_SUCCESS(state, token) {
      state.token = token;
    },
    LOGOUT(state) {
      state.token = "";
      state.user = {};
    },
  },
  actions: {
    // 异步操作 (比如 API 请求)，通过 commit mutations 来修改 state
    async login({ commit }, userData) {
      const response = await axios.post("/api/auth/login", userData);
      const token = response.data.access_token;
      localStorage.setItem("token", token); // 将 token 存入 localStorage，防止刷新丢失
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // 设置全局请求头
      commit("AUTH_SUCCESS", token);
    },
    async register(_, userData) {
      await axios.post("/api/auth/register", userData);
    },
    logout({ commit }) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      commit("LOGOUT");
    },
  },
  getters: {
    // 类似 Vue 组件的 computed 属性
    isLoggedIn: (state) => !!state.token,
  },
});
