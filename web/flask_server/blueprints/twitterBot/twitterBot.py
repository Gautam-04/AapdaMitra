from flask import Blueprint, request
import os
import tweepy

twitterBot = Blueprint("twitterBot", __name__)
client = tweepy.Client(bearer_token=os.environ['TWITTER_BEARER_TOKEN'],
                    consumer_key=os.environ['TWITTER_CONSUMER_KEY'],
                    consumer_secret=os.environ['TWITTER_CONSUMER_SECRET'],
                    access_token=os.environ['TWITTER_ACCESS_TOKEN'],
                    access_token_secret=os.environ['TWITTER_ACCESS_SECRET'])

print("Connected to TwitterAPI Successfully")

@twitterBot.route("/test")
def index():
    return "Twitter Bot."

@twitterBot.route("/reply")
def replyToPost():
    tweet_id = request.form.get("tweet_id")
    content = request.form.get("content")
    if tweet_id and content:
        client.create_tweet(text=content, in_reply_to_tweet_id=tweet_id)
        return {"Status": "Success"}
    else:
        return {"Status": "Error"}