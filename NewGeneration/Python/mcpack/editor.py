import sys, os, json, fs

templates = json.load(open(fs.join(os.path.dirname(__file__), "templates/index.json")))

def open(path, info: dict):
  import __main__
  PWD = str(path)
  TYPE = info["type"]
  while True:
    try: scanner = input("\033[32mEditor: \033[33m{}\033[36m >> \033[0m".format(info["name"]))
    except KeyboardInterrupt: scanner = "exit"
    if scanner.split(" ")[0] == "exit": 
      __main__.main()
      break
    elif scanner.split(" ")[0] == "cd":
      try: ls = fs.join(PWD, scanner.split(" ")[1], root = True)
      except IndexError: ls = fs.join(PWD, "/", root = True)
      if fs.exists(ls): PWD = ls
    elif scanner.split(" ")[0] == "ls":
      try: ls = fs.join(PWD, scanner.split(" ")[1], root = True)
      except IndexError: ls = fs.join(PWD, "", root = True)
      if fs.exists(ls):
        formatResult = "{{: <{}}}".format(len(sorted(fs.dirTree(ls), key=len)[0]) + 14)
        print("\033[33m{}\033[0m: ".format(ls), end="")
        for i,x in enumerate(fs.dirTree(ls)):
          if i % 2 == 0: sys.stdout.write("\n{}".format(formatResult).format(x))
          else: sys.stdout.write("\t{}".format(formatResult).format(x))
        print("")
    elif scanner.split(" ")[0] == "read":
      try: ls = fs.join(PWD, os.path.dirname(scanner.split(" ")[1]), root = True)
      except IndexError: ls = fs.join(PWD, "", root = True)
      ls = fs.join(ls, scanner.split(" ")[1].split("/").pop())
      if not os.path.isfile(ls): print("\033[31mError: {} is not a file".format(ls))
      else: print(open(ls, "r").read())
    # elif scanner.split(" ")[0] == "create":
      # try: 