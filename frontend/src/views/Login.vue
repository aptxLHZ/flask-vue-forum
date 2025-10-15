<template>
  <div class="login-container">
    <h2>登录</h2>
    <!-- .prevent 阻止表单默认提交行为 -->
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">登录</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    // 使用展开运算符将 vuex 的 actions 混入到 methods 中
    ...mapActions(["login"]),

    async handleLogin() {
      try {
        const userData = {
          username: this.username,
          password: this.password,
        };
        // 调用映射过来的 login action
        await this.login(userData);
        // 登录成功后给用户反馈
        alert("登录成功！");
        // 之后可以跳转到首页，例如：
        // this.$router.push({ name: 'home' });
      } catch (error) {
        // 从后端响应中获取更友好的错误信息
        this.errorMessage =
          error.response?.data?.message || "登录失败，请检查您的用户名和密码。";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
