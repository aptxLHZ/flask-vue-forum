<template>
  <div class="post-detail-container">
    <div v-if="post">
      <h1>{{ post.title }}</h1>
      <p class="post-meta">
        作者: {{ post.author }} | 发布于:
        {{ new Date(post.timestamp).toLocaleString() }}
      </p>
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
import { mapState, mapActions } from "vuex";

export default {
  name: "PostDetailView",
  props: {
    id: {
      // 接收来自路由的 id prop
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    ...mapState(["post", "comments"]),
  },
  methods: {
    ...mapActions(["fetchPost", "fetchComments"]),
  },
  created() {
    // 当组件创建时，使用 prop 'id' 来获取帖子和评论
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
</style>
