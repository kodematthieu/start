import sys, os, fs, pack, json

PWD = os.getcwd()

def main():
  import editor
  global PWD
  while True:
    try: scanner = input("\033[32mMcPack\033[36m >> \033[0m")
    except KeyboardInterrupt: scanner = "exit"
    if scanner.split(" ")[0] == "exit": sys.exit()
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
      if not os.path.isfile(ls): print("\033[31mError: {} is not a file\033[0m".format(ls))
      else: print(open(ls, "r").read())
    elif scanner.split(" ")[0] == "mkpack":
      try: name = scanner.split(" ")[1]
      except IndexError: name = None
      try: pType = scanner.split(" ")[2]
      except IndexError: pType = None
      version = "0.0.1"
      pack.create(name, pType, version, path = PWD)
    elif scanner.split(" ")[0] == "editor":
      try: ls = fs.join(PWD, scanner.split(" ")[1], root = True)
      except IndexError: ls = fs.join(PWD, "", root = True)
      if fs.exists(ls): PWD = ls
      if os.path.isfile(fs.join(PWD, "manifest.json")):
        file = open(fs.join(PWD, "manifest.json"), "r").read().split("\n")
        file.pop(0)
        pType = json.loads("\n".join(file))["modules"][0]["type"]
        name = json.loads("\n".join(file))["header"]["name"]
        version = json.loads("\n".join(file))["header"]["version"]
        data = {"name": name, "version": version, "type": pType}
        editor.open(PWD, data)
      else: print("\033[31mError: {} is not a pack\033[0m".format(os.path.dirname(PWD)))

if __name__ == '__main__': main()