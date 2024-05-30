import numpy as np
from flask import Blueprint, request

KEY = "0f25a48bb4d7-2874-xk8bqa9a-9274-32c0662120d2"

blueprint = Blueprint("devMode", __name__, url_prefix="/devMode/"+KEY)

@blueprint.route("/<string:method>", methods=["GET"])
def index(method):
  return "devMode".