<template>
  <div class="post-detail-container">
    <div v-if="post">
      <h1>{{ post.title }}</h1>
      <p class="post-meta">
        作者: {{ post.author }} | 发布于:
        {{ new Date(post.timestamp).toLocaleString() }}
      </p>
      <!-- 删除按钮 -->
      <button
        v-if="currentUser && currentUser.id === String(post.user_id)"
        @click="handleDeletePost"
      >
        删除帖子
      </button>
      <hr />
      <div class="post-content">
        <p>{{ post.content }}</p>
      </div>
    </div>
    <div v-else>
      <p>正在加载帖子详情...</p>
    </div>

    <div class="comments-section">
      <h3>评论</h3>
      <!-- 发表评论表单 (登录后显示) -->
      <div v-if="isLoggedIn" class="comment-form">
        <textarea
          v-model="newComment"
          placeholder="发表你的看法..."
          rows="4"
        ></textarea>
        <button @click="submitComment">发表评论</button>
      </div>
      <!-- 评论列表 -->
      <div v-if="comments.length">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <p>
            <strong>{{ comment.author }}:</strong>
          </p>
          <p>{{ comment.content }}</p>
          <small>{{ new Date(comment.timestamp).toLocaleString() }}</small>
        </div>
      </div>
      <div v-else>
        <p>还没有评论。</p>
      </div>
    </div>
  </div>
</template>

<script>
// --- 修复点 1: 导入 mapGetters ---
import { mapState, mapActions, mapGetters } from "vuex";
import { jwtDecode } from "jwt-decode";

export default {
  name: "PostDetailView",
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      newComment: "",
    };
  },
  computed: {
    ...mapState(["post", "comments", "token"]),
    // --- 修复点 2: 映射 isLoggedIn getter ---
    ...mapGetters(["isLoggedIn"]),
    currentUser() {
      if (this.token) {
        try {
          const decoded = jwtDecode(this.token);
          return { id: decoded.sub };
        } catch (e) {
          console.error("Invalid token:", e);
          return null;
        }
      }
      return null;
    },
  },
  methods: {
    ...mapActions([
      "fetchPost",
      "fetchComments",
      "createComment",
      "deletePost",
    ]),
    async submitComment() {
      if (!this.newComment.trim()) return;
      try {
        await this.createComment({
          postId: this.id,
          content: this.newComment,
        });
        this.newComment = "";
      } catch (error) {
        console.error("评论失败:", error);
      }
    },
    async handleDeletePost() {
      if (confirm("确定要删除这篇帖子吗？")) {
        try {
          await this.deletePost(this.id);
          this.$router.push({ name: "home" });
        } catch (error) {
          console.error("删除帖子失败:", error);
        }
      }
    },
  },
  created() {
    this.fetchPost(this.id);
    this.fetchComments(this.id);
  },
};
</script>

<style scoped>
.post-detail-container {
  max-width: 800px;
  margin: 20px auto;
  text-align: left;
}
.post-meta {
  color: #666;
  font-size: 0.9em;
}
.post-content {
  margin-top: 20px;
  line-height: 1.6;
}
.comments-section {
  margin-top: 40px;
}
.comment-item {
  border-top: 1px solid #eee;
  padding: 15px 0;
}
.comment-item p {
  margin: 5px 0;
}
.comment-item strong {
  margin-right: 5px;
}
.comment-item small {
  color: #999;
}
.comment-form {
  margin-bottom: 20px;
}
.comment-form textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.comment-form button {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
