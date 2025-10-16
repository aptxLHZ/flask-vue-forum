// frontend/src/store/index.js
import { createStore } from "vuex";
import axios from "axios";

// --- 在这里添加 baseURL 的配置 ---
// 这样，此文件中所有使用 axios 的请求都会自动带上这个前缀
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
// ------------------------------------

export default createStore({
  state: {
    // 存放状态的地方 (类似组件的 data)
    token: localStorage.getItem("token") || "",
    user: {},
    // --- new post state ---
    posts: [], // 帖子列表
    post: null, // 单个帖子详情
    comments: [], // 单个帖子的评论列表
    notification: null, // 新增：用于全局通知
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
    ADD_POST(state, post) {
      state.posts.unshift(post); // 将新帖子添加到列表的最前面
    },
    REMOVE_POST(state, postId) {
      state.posts = state.posts.filter((p) => p.id !== postId);
    },
    ADD_COMMENT(state, comment) {
      state.comments.push(comment);
    },
    SET_NOTIFICATION(state, message) {
      state.notification = message;
    },
    CLEAR_NOTIFICATION(state) {
      state.notification = null;
    },
  },
  actions: {
    // --- auth actions ---
    // 异步操作 (比如 API 请求)，通过 commit mutations 来修改 state
    async login({ commit }, userData) {
      const response = await axios.post("/auth/login", userData);
      const token = response.data.access_token;
      localStorage.setItem("token", token); // 将 token 存入 localStorage，防止刷新丢失
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // 设置全局请求头
      commit("AUTH_SUCCESS", token);
    },
    async register(_, userData) {
      await axios.post("/auth/register", userData);
    },
    logout({ commit }) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      commit("LOGOUT");
    },
    // --- new post actions ---
    async fetchPosts({ commit }) {
      const response = await axios.get("/posts/");
      commit("SET_POSTS", response.data);
    },
    async fetchPost({ commit }, postId) {
      // 在获取新帖子详情前，清空旧数据
      commit("SET_POST", null);
      commit("SET_COMMENTS", []);
      const response = await axios.get(`/posts/${postId}`);
      commit("SET_POST", response.data);
    },
    async fetchComments({ commit }, postId) {
      const response = await axios.get(`/posts/${postId}/comments`);
      commit("SET_COMMENTS", response.data);
    },
    // --- 新增 Actions ---
    async createPost({ commit, dispatch }, postData) {
      const response = await axios.post("/posts/", postData);
      commit("ADD_POST", response.data);
      dispatch("setNotification", "帖子发布成功！");
    },
    async deletePost({ commit, dispatch }, postId) {
      try {
        await axios.delete(`/posts/${postId}`);
        commit("REMOVE_POST", postId);
        dispatch("setNotification", "帖子删除成功！");
      } catch (error) {
        if (error.response?.status === 401) {
          // Token 过期，清除本地存储并跳转到登录页
          dispatch("logout");
          dispatch("setNotification", "登录已过期，请重新登录");
          // 可以在这里跳转到登录页
          window.location.href = "/login";
        } else {
          console.error("删除帖子失败:", error);
          dispatch("setNotification", "删除失败");
        }
      }
    },
    async createComment({ commit, dispatch }, { postId, content }) {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content,
      });
      commit("ADD_COMMENT", response.data);
      dispatch("setNotification", "评论发布成功！");
    },
    // 新增一个 action 用于管理通知的显示时间
    setNotification({ commit }, message) {
      commit("SET_NOTIFICATION", message);
      setTimeout(() => {
        commit("CLEAR_NOTIFICATION");
      }, 3000); // 3秒后自动清除
    },
  },
  getters: {
    // 类似 Vue 组件的 computed 属性
    isLoggedIn: (state) => !!state.token,
  },
});
