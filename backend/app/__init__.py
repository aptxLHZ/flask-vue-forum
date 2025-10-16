# app/__init__.py
from flask import Flask
from config import Config
from .extensions import db, migrate, cors, jwt
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)
    # cors.init_app(app, resources={r"/api/*": {"origins": "*"}}) # 允许所有来源访问/api/路径
    # --- 新的、更安全的 CORS 配置 ---
    frontend_url = os.environ.get('FRONTEND_URL')
    if frontend_url:
        cors(app, resources={r"/api/*": {"origins": [frontend_url]}})
    else:
        # 如果没有设置环境变量，则在开发中允许所有
        cors(app, resources={r"/api/*": {"origins": "*"}})
    # --------------------------------
    jwt.init_app(app)

    # 注册蓝图
    from .api.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # --- 新增这部分 ---
    from .api.posts import posts_bp
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    # --- 新增结束 ---
    

    return app