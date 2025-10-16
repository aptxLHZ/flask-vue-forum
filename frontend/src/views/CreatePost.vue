<template>
  <div class="create-post-container">
    <h2>发布新帖子</h2>
    <form @submit.prevent="submitPost">
      <div class="form-group">
        <label for="title">标题</label>
        <input type="text" v-model="title" id="title" required />
      </div>
      <div class="form-group">
        <label for="content">内容</label>
        <textarea v-model="content" id="content" rows="10" required></textarea>
      </div>
      <button type="submit">发布</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "CreatePostView",
  data() {
    return {
      title: "",
      content: "",
    };
  },
  methods: {
    ...mapActions(["createPost"]),
    async submitPost() {
      try {
        await this.createPost({ title: this.title, content: this.content });
        // 发布成功后跳转到首页
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error("发布帖子失败:", error);
        alert("发布失败，请稍后再试。");
      }
    },
  },
};
</script>

<style scoped>
/* (样式可以参考 Login.vue 或 Register.vue) */
.create-post-container {
  max-width: 800px;
  margin: 20px auto;
}
.form-group {
  margin-bottom: 15px;
  text-align: left;
}
label {
  display: block;
  margin-bottom: 5px;
}
input,
textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
