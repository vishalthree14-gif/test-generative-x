from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.question_routes import question_bp
from routes.web_routes import web_bp
from routes.youtube_routes import youtube_bp
from routes.quiz_routes import quiz_bp
from routes.compains_routes import compains_bp


app = Flask(__name__)

# # 🔑 THIS LINE IS IMPORTANT
# CORS(
#     app,
#     supports_credentials=True,
#     origins=["http://localhost:5173"]
# )

CORS(
    app,
    supports_credentials=True,
    origins=["http://127.0.0.1:5173"]
)



app.register_blueprint(auth_bp, url_prefix="/api")

app.register_blueprint(question_bp, url_prefix="/api")
app.register_blueprint(web_bp, url_prefix="/api")
app.register_blueprint(youtube_bp, url_prefix="/api")
app.register_blueprint(quiz_bp, url_prefix="/api")

app.register_blueprint(compains_bp, url_prefix="/api")


if __name__ == "__main__":
    app.run(debug=True, port=5050)


