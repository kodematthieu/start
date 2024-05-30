import json, os

dirname = os.path.dirname(os.path.abspath(__file__))

class offline(object):
  def __init__(self, path, *, autosave = False, autoload = False):
    super(offline, self).__init__()
    self.__data = None
    self.filepath = path
    self.autoload = autoload if type(autoload) == bool else False
    self.autosave = autosave if type(autosave) == bool else False
    if self.autoload: self.load()
  def __setitem__(self, key, value):
    if self.__data == None: return "None"
    self.__data[key] = value
    if self.autosave: self.save()
  def __getitem__(self, key):
    if self.__data == None: return "None"
    if self.autoload: self.load()
    return self.__data[key]
  def __str__(self):
    if self.__data == None: return "None"
    return json.dumps(self.__data, indent=2)
  def load(self):
    with open(os.path.join(dirname, self.filepath), "w+") as file: self.__data = json.loads(file.read() or "{}")
    return self
  def save(self):
    with open(os.path.join(dirname, self.filepath), "w") as file: file.write(json.dumps(self.__data, indent=2))
    return self