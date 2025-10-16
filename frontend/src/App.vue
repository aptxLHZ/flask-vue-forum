frontend/src/App.vue
<template>
  <div id="nav">
    <router-link to="/">首页</router-link>|
    <span v-if="isLoggedIn">
      <!-- 将来可以有创建帖子的链接 -->
      <a @click="logoutUser" href="#">登出</a>
    </span>
    <span v-else>
      <router-link to="/login">登录</router-link> |
      <router-link to="/register">注册</router-link>
    </span>
  </div>
  <!-- 这是路由的出口，匹配到的组件将在这里被渲染 -->
  <router-view />
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    ...mapActions(["logout"]),
    logoutUser() {
      this.logout();
      this.$router.push({ name: "login" }); // 登出后跳转到登录页
    },
  },
};
</script>

<style>
/* 这里是全局样式 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
