# app/__init__.py
from flask import Flask
from config import Config
from .extensions import db, migrate, cors, jwt

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}) # 允许所有来源访问/api/路径
    jwt.init_app(app)

    # 注册蓝图
    from .api.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # 可以在这里注册其他蓝图，比如帖子的
    # from .api.posts import posts_bp
    # app.register_blueprint(posts_bp, url_prefix='/api/posts')

    return app