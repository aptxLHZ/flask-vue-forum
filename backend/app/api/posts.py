# backend/app/api/posts.py
from flask import Blueprint, request, jsonify
from app.models import Post, Comment, User
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

posts_bp = Blueprint('posts', __name__)

# --- 帖子 API ---

# 创建新帖子 (需要登录)
@posts_bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    post = Post(
        title=data['title'],
        content=data['content'],
        user_id=current_user_id
    )
    db.session.add(post)
    db.session.commit()
    
    return jsonify(post.to_dict()), 201

# 获取所有帖子列表 (无需登录)
@posts_bp.route('/', methods=['GET'])
def get_posts():
    posts = Post.query.order_by(Post.timestamp.desc()).all()
    return jsonify([post.to_dict() for post in posts])

# 获取单个帖子的详情 (无需登录)
@posts_bp.route('/<int:id>', methods=['GET'])
def get_post(id):
    post = Post.query.get_or_404(id)
    return jsonify(post.to_dict())

# 删除帖子 (需要是作者本人)
@posts_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_post(id):
    post = Post.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    
    if post.user_id != current_user_id:
        return jsonify({'message': 'Permission denied'}), 403
        
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted successfully'})

# --- 评论 API ---

# 在某个帖子上创建新评论 (需要登录)
@posts_bp.route('/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def create_comment(post_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    # 确保帖子存在
    Post.query.get_or_404(post_id)
    
    comment = Comment(
        content=data['content'],
        user_id=current_user_id,
        post_id=post_id
    )
    db.session.add(comment)
    db.session.commit()
    
    return jsonify(comment.to_dict()), 201

# 获取某个帖子的所有评论 (无需登录)
@posts_bp.route('/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    # 确保帖子存在
    post = Post.query.get_or_404(post_id)
    comments = Comment.query.filter_by(post_id=post.id).order_by(Comment.timestamp.asc()).all()
    return jsonify([comment.to_dict() for comment in comments])