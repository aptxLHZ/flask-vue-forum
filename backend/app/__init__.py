# app/__init__.py
from flask import Flask
from config import Config
from .extensions import db, migrate, jwt
import os
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # cors.init_app(app, resources={r"/api/*": {"origins": "*"}}) # 允许所有来源访问/api/路径
  # --- 正确的 CORS 初始化方式 ---
    # 使用我们刚刚导入的 CORS 类，而不是一个实例
    frontend_url = os.environ.get('FRONTEND_URL')
    if frontend_url:
        CORS(app, resources={r"/api/*": {"origins": [frontend_url]}})
    else:
        CORS(app, resources={r"/api/*": {"origins": "*"}})
    # --------------------------------
    # 注册蓝图
    from .api.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # --- 新增这部分 ---
    from .api.posts import posts_bp
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    # --- 新增结束 ---
    

    return app