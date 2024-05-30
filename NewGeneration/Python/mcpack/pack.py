import sys, os, random, time, json, fs

folders = json.load(open(fs.join(os.path.dirname(__file__), "folders.json")))

def uuid():
  Id = []
  for e in "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx":
    if e == "x":
      e = hex(random.randint(0,15)).split("x")[1]
    Id.append(e)
  return "".join(Id)

def create(name, pType, v, path):
  name = input("name: ({})".format(name) if name != None else "name: ") or (name if name != None else "Unnamed")
  description = input("description: ")
  version = input("version: ({})".format(v)) or v
  pType = input("type: ({})".format(pType) if pType != None else "type: (resources)") or (pType if pType != None else "resources")
  mkfolder(path, name)
  path = fs.join(path, name)
  sys.stdout.write("\n")
  pack = {"format_version": 2,"header": {"description": description,"name": name,"uuid": uuid(),"version": [int(e) for e in v.split(".")],"min_engine_version": [1, 14, 0]},"modules": [{"description": description,"type": pType,"uuid": uuid(),"version": [int(e) for e in v.split(".")]}]}
  manifest = json.dumps(pack, indent=2)
  open(fs.join(path, "manifest.json"), "w").write("// This is autogenerated by McPack. Not allowed to change this unless it's necessary\n"+manifest)
  open(fs.join(path, "contents.json"), "w").write(json.dumps(["manifest.json"]))
  print("\r\033[36mFile \033[32m`manifest.json`\033[36m has been created!\033[0m")
  print("\r\033[36mFile \033[32m`contents.json`\033[36m has been created!\033[0m")
  for i in range(101):
    if i % 6 == 0:
      try:
        e = folders[pType][int(i/6)]
        mkfolder(path, e)
      except IndexError: pass
    sys.stdout.write("\r\033[33mGenerating \033[32m{} pack\033[0m {}%".format(name,i))
    sys.stdout.flush()
    time.sleep(random.random()/50)
  print()

def mkfolder(path, name):
  os.mkdir(fs.join(path, name))
  print("\r\033[36mFolder \033[32m`{}`\033[36m has been created!".format(name))