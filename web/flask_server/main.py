from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

# ENV Vars
PORT = os.environ['PORT']

# Blueprints
from blueprints.testBlueprint.test import test
from blueprints.elastic.elastic import search
from blueprints.twitterBot.twitterBot import twitterBot
from blueprints.geminiLLM.geminiLLM import geminiLLM
from blueprints.aapdaBot.aapdaBot import bot

app = Flask(__name__)
CORS(app,supports_credentials=True)

# Register Blueprints
app.register_blueprint(test)
app.register_blueprint(search, url_prefix="/search")
app.register_blueprint(twitterBot, url_prefix="/twitter")
app.register_blueprint(geminiLLM, url_prefix="/gemini")
app.register_blueprint(bot, url_prefix="/chatbot")

if __name__ == "__main__":
    app.run(port=PORT, debug=False)