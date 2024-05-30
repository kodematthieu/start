
ELEMENTS = [{'name': 'Hydrogen', 'symbol': 'H', 'proton': 1, 'neutron': 0}, {'name': 'Helium', 'symbol': 'He', 'proton': 2, 'neutron': 2}, {'name': 'Lithium', 'symbol': 'Li', 'proton': 3, 'neutron': 4}, {'name': 'Beryllium', 'symbol': 'Be', 'proton': 4, 'neutron': 5}, {'name': 'Boron', 'symbol': 'B', 'proton': 5, 'neutron': 6}, {'name': 'Carbon', 'symbol': 'C', 'proton': 6, 'neutron': 6}, {'name': 'Nitrogen', 'symbol': 'N', 'proton': 7, 'neutron': 7}, {'name': 'Oxygen', 'symbol': 'O', 'proton': 8, 'neutron': 8}, {'name': 'Fluorine', 'symbol': 'F', 'proton': 9, 'neutron': 10}, {'name': 'Neon', 'symbol': 'Ne', 'proton': 10, 'neutron': 10}, {'name': 'Sodium', 'symbol': 'Na', 'proton': 11, 'neutron': 12}, {'name': 'Magnesium', 'symbol': 'Mg', 'proton': 12, 'neutron': 12}, {'name': 'Aluminum', 'symbol': 'Al', 'proton': 13, 'neutron': 14}, {'name': 'Silicon', 'symbol': 'Si', 'proton': 14, 'neutron': 14}, {'name': 'Phosphorus', 'symbol': 'P', 'proton': 15, 'neutron': 16}, {'name': 'Sulfur', 'symbol': 'S', 'proton': 16, 'neutron': 16}, {'name': 'Chlorine', 'symbol': 'Cl', 'proton': 17, 'neutron': 18}, {'name': 'Argon', 'symbol': 'Ar', 'proton': 18, 'neutron': 22}, {'name': 'Potassium', 'symbol': 'K', 'proton': 19, 'neutron': 20}, {'name': 'Calcium', 'symbol': 'Ca', 'proton': 20, 'neutron': 20}, {'name': 'Scandium', 'symbol': 'Sc', 'proton': 21, 'neutron': 24}, {'name': 'Titanium', 'symbol': 'Ti', 'proton': 22, 'neutron': 26}, {'name': 'Vanadium', 'symbol': 'V', 'proton': 23, 'neutron': 28}, {'name': 'Chromium', 'symbol': 'Cr', 'proton': 24, 'neutron': 28}, {'name': 'Manganese', 'symbol': 'Mn', 'proton': 25, 'neutron': 30}, {'name': 'Iron', 'symbol': 'Fe', 'proton': 26, 'neutron': 30}, {'name': 'Cobalt', 'symbol': 'Co', 'proton': 27, 'neutron': 32}, {'name': 'Nickel', 'symbol': 'Ni', 'proton': 28, 'neutron': 30}, {'name': 'Copper', 'symbol': 'Cu', 'proton': 29, 'neutron': 34}, {'name': 'Zinc', 'symbol': 'Zn', 'proton': 30, 'neutron': 35}, {'name': 'Gallium', 'symbol': 'Ga', 'proton': 31, 'neutron': 39}, {'name': 'Germanium', 'symbol': 'Ge', 'proton': 32, 'neutron': 40}, {'name': 'Arsenic', 'symbol': 'As', 'proton': 33, 'neutron': 42}, {'name': 'Selenium', 'symbol': 'Se', 'proton': 34, 'neutron': 45}, {'name': 'Bromine', 'symbol': 'Br', 'proton': 35, 'neutron': 45}, {'name': 'Krypton', 'symbol': 'Kr', 'proton': 36, 'neutron': 47}]
ELECTRON_CONFIG = {'max': {'s': 2, 'p': 6, 'd': 10, 'f': 14}, 'order': [{'block': 's', 'lvl': 1}, {'block': 's', 'lvl': 2}, {'block': 'p', 'lvl': 2}, {'block': 's', 'lvl': 3}, {'block': 'p', 'lvl': 3}, {'block': 's', 'lvl': 4}, {'block': 'd', 'lvl': 3}, {'block': 'p', 'lvl': 4}, {'block': 's', 'lvl': 5}, {'block': 'd', 'lvl': 4}, {'block': 'p', 'lvl': 5}, {'block': 's', 'lvl': 6}, {'block': 'f', 'lvl': 4}, {'block': 'd', 'lvl': 5}, {'block': 'p', 'lvl': 6}, {'block': 's', 'lvl': 7}, {'block': 'f', 'lvl': 5}, {'block': 'd', 'lvl': 6}, {'block': 'p', 'lvl': 7}, {'block': 'f', 'lvl': 6}, {'block': 'd', 'lvl': 7}, {'block': 'f', 'lvl': 7}]}

SUPERNUM = [8304, 185, 178, 179, *range(8308, 8313)]

class Element(object):
  def __init__(self, symbol: str):
    super(Element, self).__init__()
    try:
      data = list(filter(lambda e: e["symbol"] == symbol, ELEMENTS))[0]
      data["electron"] = {"max": data["proton"], "value": data["proton"]}
    except:
      raise KeyError("Element not found!")
    for k,v in data.items():
      setattr(self, k, v)
    count = self.electron["max"]
    block_max = ELECTRON_CONFIG["max"]
    block_order = ELECTRON_CONFIG["order"]
    self.electron_config = []
    i = 0
    while count > 0:
      value = 0
      if count >= block_max[block_order[i]["block"]]:
        value = block_max[block_order[i]["block"]]
        count -= block_max[block_order[i]["block"]]
      else:
        value = count
        count -= count
      self.electron_config.append({"block": block_order[i]["block"], "lvl": block_order[i]["lvl"], "value": value})
      i += 1
    self.electron_lvls = sorted({e["lvl"] for e in self.electron_config})
    max_lvl = max(self.electron_lvls)
    self.valance_electron = (eval("+".join([str(e["value"]) for e in self.electron_config if e["lvl"] == max_lvl])), eval("+".join([str(block_max[e["block"]]) for e in self.electron_config if e["lvl"] == max_lvl])))
  def __repr__(self): return "{0.name} <P: {0.proton}, N: {0.neutron}, E: {0.electron[value]}>".format(self)
  def __str__(self): return self.symbol
  # def __add__(self, other):
  #   if type(other) != element: raise NotImplemented
    
  
  @property
  def config(self):
    data = []
    for e in self.electron_config:
      value = str(e["value"])
      for i,c in enumerate(SUPERNUM):
        value = value.replace(str(i), chr(c))
      data.append("{0[lvl]}{0[block]}{1}".format(e, value))
    return ", ".join(data)
  @property
  def valance(self):
    return "{.name} {}".format(self, self.valance_electron)

class Compound(object):
  def __init__(self, *elems):
    super(Compound, self).__init__()
    self.elems = []
    for e in elems:
      if type(e) == Element:
        self.elems.append(e)
      else: raise ValueError("{} is not a type Element".format(e))

# while True:
#   elem = input("Element: ")
#   try :
#     result = Element(elem)
#     print(result.config, result.valance, sep="\n")
#   except KeyError:
#     print("Element not found: " + elem)