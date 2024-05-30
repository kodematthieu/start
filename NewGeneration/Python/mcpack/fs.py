import os

def exists(file: str):
  if os.path.isdir(file): return True
  print("\033[31mError: {} is not a directory".format(file))
  return False

def dirTree(file: str):
  for _, subdirList, fileList in os.walk(file):
    tree = []
    for x in fileList: tree.append("\033[36m{}\033[0m".format(x))
    for x in subdirList: tree.append("\033[32m{}\033[0m".format(x))
    return sorted(tree)

def join(cwd, *fs, root: bool = False):
  for E in fs:
    if E.startswith("/") and root: return E
    for e in E.split("/"):
      if e == "..":
        cwd = cwd.split("/")
        cwd.pop()
        cwd = "/".join(cwd)
      elif e != "":
        cwd = cwd + "/" + e
  return cwd
