import sys, os, re, pickle, Squark, devMode
from termcolor import colored
from datatype import datastore
from getpass import getpass as Password
from pyfiglet import figlet_format as figlet

devAcc = pickle.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "devAcc.data"), "rb"))

clear = lambda: print('\033c')
def exit(): 
  print(colored(figlet("Goodbye!"), "green"));
  sys.exit()

clear()
print(colored(figlet("Squark AI"), "yellow"))

def command(cmd, *args):
  if cmd == "exit": exit()
  elif cmd == "restart":
    print(colored("Restarting...", "red"))
    try: 
      os.system("python " + sys.argv[0])
      sys.exit()
    except KeyboardInterrupt: pass
  elif cmd == "devMode":
    # try:
    #   username = input(colored("Username: ", "yellow"))
    #   password = Password(colored("Password: ", "yellow"))
    # except KeyboardInterrupt: return
    # if username != devAcc["username"]: return print(colored("Invalid username!", "red"))
    # if password != devAcc["password"]: return print(colored("Invalid password!", "red"))
    print(colored("Running devMode...", "red"))
    devMode.run()

while True:
  try: scanner = input(colored("|squark-ai|", "green")+colored("=> ", "cyan"))
  except KeyboardInterrupt: exit()
  if re.match(r"^/", scanner.split(" ")[0]): command(re.sub(r"^/", "", scanner.split(" ")[0]), *scanner.split(" ")[1:])
