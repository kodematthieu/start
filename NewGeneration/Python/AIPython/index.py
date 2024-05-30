import os, re
import words, devMode
from flask import Flask, request, redirect

port = int(os.environ.get("PORT", 3000))

app = Flask(__name__)
app.register_blueprint(devMode.blueprint)
# app.config["DEBUG"] = True

@app.route("/", methods=["GET"])
def main():
  return ""

if __name__ == "__main__": app.run(port=port)