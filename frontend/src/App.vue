<!-- frontend/src/App.vue -->
<template>
  <div id="nav">
    <router-link to="/login">登录</router-link> |
    <router-link to="/register">注册</router-link>
  </div>
  <!-- 这是路由的出口，匹配到的组件将在这里被渲染 -->
  <router-view />
</template>

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
