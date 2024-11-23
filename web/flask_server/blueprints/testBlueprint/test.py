from flask import Blueprint, request

test = Blueprint("test", __name__)

@test.route("/")
def index():
    return "Test Blueprint!"