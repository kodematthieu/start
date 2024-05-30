import math
# from random import random, randint

class Vector(object):
  def __init__(self, x = None, y: float = None, z: float = 0.0):
    super(Vector, self).__init__()
    if type(x) == Vector: z = x.z; y = x.y; x = x.x
    if x != None and y == None: raise ValueError("Vectors should have at least 2 arguments or no argument")
    self.x = x or 0.0
    self.y = y or 0.0
    self.z = z
  def __str__(self): return "Vector: {0.x}, {0.y}, {0.z}".format(self)
  __repr__ = __str__
  def __neg__(self): return Vector(-self.x,-self.y,-self.z)
  def __add__(self, other):
    if type(other) != Vector: return NotImplemented
    return Vector(self.x+other.x,self.y+other.y,self.z+other.z)
  def __sub__(self, other):
    if type(other) != Vector: return NotImplemented
    return Vector(self.x-other.x,self.y-other.y,self.z-other.z)
  def __mul__(self, other):
    if type(other) != Vector: return NotImplemented
    return Vector(self.x*other.x,self.y*other.y,self.z*other.z)
  def __truediv__(self, other):
    if type(other) != Vector: return NotImplemented
    self.z = 1 if self.z == 0 else self.z
    other.z = 1 if other.z == 0 else other.z
    return Vector(self.x/other.x,self.y/other.y,self.z/other.z)
  def __pow__(self, other):
    if type(other) != int and type(other) != float: return NotImplemented
    return Vector(self.x**other,self.y**other,self.z**other)
  __iadd__ = __add__
  __isub__ = __sub__
  __imul__ = __mul__
  __itruediv__ = __truediv__
  mag = __ipow__ = __pow__
  def __eq__(self, other):
    if type(other) != Vector: return False
    return self.x == other.x and self.y == other.y and self.z == other.z
  def __abs__(self): return Vector(abs(self.x),abs(self.y),abs(self.z))
  def __lt__(self, other):
    if type(other) != Vector: return NotImplemented
    vec1 = math.hypot(self.x,self.y,self.z)
    vec2 = math.hypot(other.x,other.y,other.z)
    return vec1 < vec2
  def __gt__(self, other):
    if type(other) != Vector: return NotImplemented
    vec1 = math.hypot(self.x,self.y,self.z)
    vec2 = math.hypot(other.x,other.y,other.z)
    return vec1 > vec2
  def __le__(self, other):
    if type(other) != Vector: return NotImplemented
    vec1 = math.hypot(self.x,self.y,self.z)
    vec2 = math.hypot(other.x,other.y,other.z)
    return vec1 <= vec2
  def __ge__(self, other):
    if type(other) != Vector: return NotImplemented
    vec1 = math.hypot(self.x,self.y,self.z)
    vec2 = math.hypot(other.x,other.y,other.z)
    return vec1 >= vec2
  def __max__(self, other):
    if type(other) != Vector: return NotImplemented
    if(max(self.length,other.length) == self.length) return self
    if(max(self.length,other.length) == other.length) return other
  def __min__(self, other):
    if type(other) != Vector: return NotImplemented
    if(min(self.length,other.length) == self.length) return self
    if(min(self.length,other.length) == other.length) return other
  @property
  def length(self): return math.hypot(self.x,self.y,self.z)
  def disp(self, other):
    if type(other) != Vector: return NotImplemented
    return max(self, other) - min(self, other)
  def dist(self, other):
    if type(other) != Vector: return NotImplemented
    return math.hypot(self.disp(other).x,self.disp(other).y,self.disp(other).z)




