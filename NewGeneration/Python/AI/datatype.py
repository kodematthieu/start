import json, os

dirname = os.path.dirname(os.path.abspath(__file__))

class infArr(object):
  def __init__(self, arr = None):
    super(infArr, self).__init__()
    self.__data = []
    if type(arr) in (list, tuple, type(self)):
      for e in arr: self.__data.append(e)
  def __getitem__(self, key):
    res = None
    try: res = self.__data[key]
    except: pass
    return res
  def __setitem__(self, key, value):
    self.__data[key] = value
    return self
  def __add__(self, other):
    res = list(self.__data)
    if type(other) in (list, tuple, type(self)): res = res + list(other)
    else: res.append(other)
    return self.__init__(res)
  def __sub__(self, other):
    res = list(self.__data)
    if type(other) in (list, tuple, type(self)):
      for e in other:
        if e in res: res.remove(e)
    else:
      if other in res: res.remove(other)
    return self.__init__(res)
  def __radd__(self, other):
    res = list(self.__data)
    if type(other) in (list, tuple, type(self)): res = list(other) + res
    else: res.insert(0, other)
    return self.__init__(res)
  __rsub__ = __sub__
  def __len__(self): return self.length
  def __repr__(self): return "{0[__class__][__name__]}: {1}".format(self, [e for e in self])
  def __iter__(self): return (e for e in self.__data)
  
  @property
  def length(self): return len(self.__data)
  @classmethod
  def From(cls, other): return cls(other)
  
  def after(self, item):
    self.__data.append(item)
    return self
  def before(self, item):
    self.__data.insert(0, item)
    return self

class datastore(object):
  def __init__(self, path, *, autosave = False, autoload = False):
    super(datastore, self).__init__()
    self.__data = None
    self.filepath = path
    self.autoload = autoload if type(autoload) == bool else False
    self.autosave = autosave if type(autosave) == bool else False
    if self.autoload: self.load()
  def __setitem__(self, key, value):
    if not self.__data: return "None"
    self.__data[key] = value
    if self.autosave: self.save()
  def __getitem__(self, key):
    if not self.__data: return "None"
    if self.autoload: self.load()
    return self.__data[key]
  def __str__(self):
    if not self.__data: return "None"
    return json.dumps(self.__data, indent=2)
  def load(self):
    self.__data = json.loads(open(os.path.join(dirname, self.filepath), "r").read() or "{}")
    return self
  def save(self):
    open(os.path.join(dirname, self.filepath), "w").write(json.dumps(self.__data, indent=2))
    return self