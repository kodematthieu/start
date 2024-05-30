import sys, os
from termcolor import colored
from datatype import datastore
from datatype import infArr

def run():
  while True:
    try: scanner = input(colored("|squark-ai:dev-mode|", "green")+colored("=> ", "cyan"))
    except KeyboardInterrupt: break
    cmd = scanner.split(" ")[0]
    subcmd = infArr(cmd.split(":"))
    args = infArr(scanner.split(" ")[1:])
    if cmd == "exit" or cmd == "quit": break
    if subcmd[0] == "test":
      print(subcmd[1])