"Inside this module are some functions and a class that is about file systems."

def mkFolder(path: str):
  "This creates a folder to the path given if it didn't exist"
  import os
  if not os.path.exists(path):
    os.mkdir(path)
    return True
  return False
def mkFile(path: str):
  "This creates a file to the path given if it didn't exist"
  import os
  if not os.path.exists(path):
    file = open(path, "w")
    return True
  return False
def rmFile(path: str):
  "This deletes the file to the path given if it exists"
  import os
  if not os.path.exists(path):
    return False
  os.remove(path)
  return True

class storage(object):
  """
  This is an offline database. To put items use it as dict.
  You can either set it into 'autosave' (via __init__) or manually save it with storage.save().
  You can either set it into 'autoload' (via __init__) or manually load it with storage.load().
  You can use clear to delete all items.
  """
  def __init__(self, location: str, **opts):
    import os
    super(storage, self).__init__()
    self.storage = {}
    self.location = location
    self.autoload = opts.get("autoload", False)
    self.autosave = opts.get("autosave", True)
    self.username = opts.get("username", "Unknown")
    self.password = opts.get("password", "not set")
    self.seed = opts.get("seed", "12'34'56'78'90")
    if os.path.dirname(self.location) != "": mkFolder(os.path.dirname(self.location))
    if mkFile(self.location): self.save()
    self.load()
  def __getitem__(self, key):
    if self.autoload: self.load()
    return self.storage.get(key,'undefined')
  def __setitem__(self, key, value):
    self.storage[key] = value
    if self.autosave: self.save()
  def __delitem__(self, key):
    del self.storage[key]
    if self.autosave: self.save()
  def __contains__(self, key):
    if self.autoload: self.load()
    return True if self.storage.get(key,None) != None else False
  def __iter__(self): 
    if self.autoload: self.load()
    return ([key,value] for key,value in self.storage.items())
  def __dict__(self): return dict(self.storage)
  def __len__(self): 
    if self.autoload: self.load()
    return len(self.storage)
  def __str__(self): return str(self.storage)
  def __del__(self):
    import os
    os.remove(self.location)
  def clear(self):
    self.storage = {}
    if self.autosave: self.save()
  def load(self): 
    import json, os, hashlib
    file = str(open(self.location, "r").read()).split("\n")
    if file[len(file)-2] != hashlib.md5(bytes(self.username, "utf-8")).hexdigest(): raise ValueError("Invalid username!")
    if file[len(file)-1] != hashlib.md5(bytes(self.password, "utf-8")).hexdigest(): raise ValueError("Invalid password!")
    del file[len(file)-2]
    del file[len(file)-1]
    self.storage = json.loads(storage.decompile(self.seed, "\n".join(file)) if storage.decompile(self.seed, "\n".join(file)) != "" else "{}")
    self.size = os.path.getsize(self.location)
  def save(self):
    import json, os, hashlib
    file = open(self.location, "w")
    data = [storage.compile(self.seed, json.dumps(self.storage) if self.storage else ""), hashlib.md5(bytes(self.username, "utf-8")).hexdigest(), hashlib.md5(bytes(self.password, "utf-8")).hexdigest()]
    file.write("\n".join(data))
    file.close()
    self.size = os.path.getsize(self.location)
    
  @staticmethod
  def compile(seed: str, txt: str) -> str:
    "This compiles any given text into nonreadable text depending on the given seed"
    seed = seed.split("'")
    fseed = []
    if len(seed) != 5: raise ValueError("argument `seed` should be separated with `'` four times")
    for e in seed:
      if int(e) > 99 or int(e) < 0: raise ValueError("faulty component `{}` of seed `{}`. It should have a value ranging from 0 to 99".format(e, "'".join(seed)))
      fseed.append(int(e))
    ntxt = []
    for i in range(len(txt)):
      e = ord(txt[i]); e ^= fseed[3]; e *= 8; e ^= fseed[2]; e ^= min(fseed[1], fseed[4]); e ^= max(fseed[0], fseed[3]); e = chr(e)
      ntxt.append(e)
    return "".join(ntxt)
  @staticmethod
  def decompile(seed: str, txt: str) -> str:
    "This decompiles any given text into nonreadable text depending on the given seed. Warning: if the seed wasn't the seed used to compile it, we have some issue there."
    seed = seed.split("'")
    fseed = []
    if len(seed) != 5: raise ValueError("argument `seed` should be separated with `'` four times")
    for e in seed:
      if int(e) > 99 or int(e) < 0: raise ValueError("faulty component `{}` of seed `{}`. It should have a value ranging from 0 to 99".format(e, "'".join(seed)))
      fseed.append(int(e))
    ntxt = []
    for i in range(len(txt)):
      e = ord(txt[i]); e ^= max(fseed[0], fseed[3]); e ^= min(fseed[1], fseed[4]); e ^= fseed[2]; e /= 8; e = int(e); e ^= fseed[3]; e = chr(e)
      ntxt.append(e)
    return "".join(ntxt)
  @staticmethod
  def online() -> bool:
    import socket
    try:
      socket.setdefaulttimeout(3)
      socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect(("8.8.8.8", 53))
      return True
    except socket.error as ex: return False

    