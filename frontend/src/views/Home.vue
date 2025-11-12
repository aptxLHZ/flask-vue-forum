<template>
  <div class="home-container">
    <div class="header">
      <h1>论坛首页</h1>
      <!-- 只有登录后才显示此按钮 -->
      <router-link v-if="isLoggedIn" :to="{ name: 'createPost' }">
        <button>发布新帖子</button>
      </router-link>
    </div>

    <div v-if="posts.length">
      <div v-for="post in posts" :key="post.id" class="post-item">
        <!-- 使用 router-link 跳转到帖子详情页 -->
        <router-link :to="{ name: 'postDetail', params: { id: post.id } }">
          <h2>{{ post.title }}</h2>
        </router-link>
        <p>
          作者: {{ post.author }} | 发布于:
          {{ new Date(post.timestamp).toLocaleString() }}
        </p>
      </div>
    </div>
    <div v-else>
      <p>正在加载帖子... 或 还没有任何帖子。</p>
    </div>
  </div>
</template>

<script>
// --- 修复点 1: 导入 mapGetters ---
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "HomeView",
  computed: {
    // 使用 mapState 辅助函数将 store 中的 posts 映射到组件的 computed 属性
    ...mapState(["posts"]),
    // --- 修复点 2: 映射 isLoggedIn getter ---
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    ...mapActions(["fetchPosts"]),
  },
  created() {
    // 当组件被创建时，调用 action 来获取帖子列表
    this.fetchPosts();
  },
};
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 20px auto;
}

/* --- 修复点 3: 添加 header 样式 --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header h1 {
  margin: 0;
}
/* ---------------------------------- */

.post-item {
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  text-align: left;
}
.post-item h2 {
  margin: 0 0 10px 0;
}
.post-item p {
  color: #666;
  font-size: 0.9em;
}
.post-item a {
  text-decoration: none;
  color: #2c3e50;
}
.post-item a:hover {
  text-decoration: underline;
}
</style>
