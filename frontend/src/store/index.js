// frontend/src/store/index.js
import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    // 存放状态的地方 (类似组件的 data)
    token: localStorage.getItem("token") || "",
    user: {},
    // --- new post state ---
    posts: [], // 帖子列表
    post: null, // 单个帖子详情
    comments: [], // 单个帖子的评论列表
  },
  mutations: {
    // --- auth mutations ---
    // 同步修改 state 的唯一方法 (类似组件的 methods，但必须是同步的)
    AUTH_SUCCESS(state, token) {
      state.token = token;
    },
    LOGOUT(state) {
      state.token = "";
      state.user = {};
    },
    // --- new post mutations ---
    SET_POSTS(state, posts) {
      state.posts = posts;
    },
    SET_POST(state, post) {
      state.post = post;
    },
    SET_COMMENTS(state, comments) {
      state.comments = comments;
    },
  },
  actions: {
    // --- auth actions ---
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
    // --- new post actions ---
    async fetchPosts({ commit }) {
      const response = await axios.get("/api/posts/");
      commit("SET_POSTS", response.data);
    },
    async fetchPost({ commit }, postId) {
      // 在获取新帖子详情前，清空旧数据
      commit("SET_POST", null);
      commit("SET_COMMENTS", []);
      const response = await axios.get(`/api/posts/${postId}`);
      commit("SET_POST", response.data);
    },
    async fetchComments({ commit }, postId) {
      const response = await axios.get(`/api/posts/${postId}/comments`);
      commit("SET_COMMENTS", response.data);
    },
  },
  getters: {
    // 类似 Vue 组件的 computed 属性
    isLoggedIn: (state) => !!state.token,
  },
});
