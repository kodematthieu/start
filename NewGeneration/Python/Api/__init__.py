import re
class server(object):
  __host, __port = None, None
  __route = []
  def __init__(self):
    super(server, self).__init__()
  def get(self, path):
    path = Param(path)
    def decorator(func):
      self.__route.append({"methon": "GET", "callback": func, "route": path})
      return func
    return decorator
  def run(self, callback = lambda x: None, *, host: str = None, port: int = None):
    from paste import httpserver
    if type(host) != str: host = "127.0.0.1"
    if type(port) != int: port = 8000
    self.__host = host
    self.__port = port
    def served(env, send):
      header = Headers(env)
      path = env.pop("PATH_INFO")
      for route in [x for x in self.__route if x["route"].check(path)]:
        print(route)
      send(f"200 OK", [])
      return [b"True"]
    httpserver.serve(served, host=host, port=port)
  @property
  def address(self): return (self.__host, self.__port) if (self.__host, self.__port) != (None, None) else None

class Headers(dict):
  def __init__(self, obj = None, **kwargs):
    super(Headers, self).__init__()
    if type(obj) != dict: obj = kwargs
    whitelist = ["a-im", "accept", "accept-charset", "accept-encoding", "accept-language", "accept-datetime", "accept-control-request-method", "accept-control-request-headers", "authorization", "cache-control", "connection", "content-length", "content-type", "cookie", "date", "expect", "forwarded", "from", "host", "if-match", "if-modified-since", "if-none-match", "if-range", "if-unmodified-since", "max-forwads", "origin", "pragma", "proxy-authorization", "range", "referer", "te", "user-agent", "upgrade", "via", "warning"]
    copy = {}
    for k in obj.keys():
      key = k.lower().replace("_", "-")
      if key.startswith("http-"): key = key[5:]
      if not (key in whitelist or key.startswith("x-")): continue
      copy[key] = obj[k]
    for k in sorted(copy.keys()): self[k] = copy[k]
  def __getattr__(self, key): return self.get(key.lower().replace("_", "-"), None)
  def __setattr__(self, key, value): return self.set(key.lower().replace("_", "-"), value)
  def __repr__(self): return f"Header {dict(self)}"
  def delete(self, k):
    v = self[k]
    del self[k]
    return v

class Param(object):
  def __init__(self, route: str, parent = ""):
    super(Param, self).__init__()
    self.regex = route.split("/")
    self.rules = []
    self.regex.pop(0)
    for v in self.regex:
      k = self.regex.index(v)
      if not v.startswith(":"):
        v = v.replace(".", "\.")
        self.regex[k] = v
        continue
      v = v[1:]
      name = re.match("^[a-z][a-z0-9]*", v, re.I)
      types, allowed, regex = (None, None, None)
      try: types = re.findall("^[a-z][a-z0-9]*\[(.*?)\]", v)[0].split("|")
      except IndexError: types = None
      if types == None:
        try: allowed = re.findall("^[a-z][a-z0-9]*\((.*?)\)", v)[0].split("|")
        except IndexError: allowed = None
        if allowed == None:
          try: regex = re.findall("^[a-z][a-z0-9]*\{(.*?)\}", v)[0]
          except IndexError: regex = None
      self.rules.append({"param": name.group(), "allowed": allowed, "regex": regex, "type": [x for x in types if x in ["int", "str", "float"]] if types != None else None})
      self.regex[k] = "([a-z0-9A-Z\:\[\]\(\)\|%\{\}\$\.]+)"
    self.regex = "^\/"+"\/".join(self.regex)+"$"
  def check(self, path):
    match = re.findall(self.regex, path)
    try: match = match[0] if type(match[0]) == tuple else (match[0],)
    except IndexError: match = []
    if len(match) == 0: return False
    for v in match:
      k = match.index(v)
      rules = None
      if self.rules[k].get("type", None) != None: rules = [eval(x) for x in self.rules[k]["type"]]
      elif self.rules[k].get("allowed", None) != None: rules = tuple(self.rules[k]["allowed"])
      elif self.rules[k].get("regex", None) != None: rules = self.rules[k]["regex"]
      if type(rules) == list:
        verify = []
        if int in rules and not re.match("^[0-9]+$", v): verify.append(False)
        if float in rules and not re.match("^[0-9]+\.[0-9]+$", v): verify.append(False)
        if str in rules and not re.match("^[a-zA-Z][a-z0-9A-Z\.\-_]+$", v): verify.append(False)
        if len(verify) == len(rules): return False
      if type(rules) == tuple and not v in rules: return False
      if type(rules) == str and re.match(rules, v) == None: return False
    return True
  def parse(self, path):
    final = {}
    match = re.findall(self.regex, path)
    match = match[0] if type(match[0]) == tuple else (match[0],)
    if len(match) == 0: return False
    for v in match:
      k = match.index(v)
      rules = None
      if self.rules[k].get("type", None) != None: rules = [eval(x) for x in self.rules[k]["type"]]
      if type(rules) == list:
        if int in rules and re.match("^[0-9]+$", v): v = int(v)
        elif float in rules and re.match("^[0-9]+\.[0-9]+$", v): v = float(v)
        elif str in rules and re.match("^[a-zA-Z][a-z0-9A-Z\.\-_]+$", v): v = str(v)
      name = self.rules[k]["param"]
      final[name] = v
    return final

class Request(dict):
  def __init__(self, obj:dict = {}, **kwargs):
    super(Request, self).__init__()
    obj.update(kwargs)
    whitelist = ["protocol", "port", "host", "url", "originalUrl", "method", "headers", "param", "query", "app"]
    for k,v in obj:
      k = k.lower().replace("-", "_")
      self[k] = v