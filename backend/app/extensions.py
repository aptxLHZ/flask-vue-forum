# app/extensions.py
# 所有flask扩展的实例对象放在这里，避免循环导入问题
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
# from flask_cors import CORS
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()
# cors = CORS()
jwt = JWTManager()