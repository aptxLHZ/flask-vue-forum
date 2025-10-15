# app/models.py
from .extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255)) #此处由128增长为255
    # --- 建立关系 ---
    # backref='author' 会在 Post 模型中创建一个虚拟的 .author 属性，可以直接访问到关联的 User 对象
    posts = db.relationship('Post', backref='author', lazy=True)
    comments = db.relationship('Comment', backref='author', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
# --- 新增 Post 模型 ---
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.datetime.utcnow)
    # --- 建立外键关系 ---
    # user.id 指的是 user 表的 id 列
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    comments = db.relationship('Comment', backref='post', lazy=True, cascade="all, delete-orphan")
    
    # 增加一个 to_dict 方法，方便序列化为 JSON
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'timestamp': self.timestamp.isoformat() + 'Z',
            'user_id': self.user_id,
            'author': self.author.username, # 通过 backref 直接获取作者名
        }


# --- 新增 Comment 模型 ---
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'timestamp': self.timestamp.isoformat() + 'Z',
            'user_id': self.user_id,
            'author': self.author.username,
            'post_id': self.post_id
        }