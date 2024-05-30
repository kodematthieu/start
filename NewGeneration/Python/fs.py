import os
import sys

def write(location, data=""):
  if not os.path.exists("/".join(location.split("/")[0:len(location.split("/"))-1])):
    os.makedirs("/".join(location.split("/")[0:len(location.split("/"))-1]))
  with open(location, "w") as file:
    file.write(data)
    return "Success"
  return "Failed"

def read(location):
  with open(location, "r") as file:
    return file.read();
  return "Failed"

def append(location, data):
  with open(location, "a") as file:
    file.write(data)
    return "Success"
  return "Failed"
  
def prepend(location, data):
  with open(location, "r+") as file:
    file.write(data + file.read())
    return "Success"
  return "Failed"
  
write("Artificial-Talker/AI.hellp")