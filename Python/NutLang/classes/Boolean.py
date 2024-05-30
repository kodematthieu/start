from .Object import Object

class Boolean(Object):
    def __init__(self, value):
        super(Boolean, self).__init__()
        if value == 'true' or value == True: self.value = True
        elif value == 'false' or value == False: self.value = False
        elif type(value) == int: self.value = value != 0
        
    def __op_add__(self, other): return Number(self.value + other.value)
    def __op_sub__(self, other): return Number(self.value - other.value)
    def __op_mul__(self, other): return Number(self.value * other.value)
    def __op_div__(self, other): return Number(self.value / other.value)
    
    def __comp_eq__(self, other): return Boolean(self.value == other.value)
    def __comp_ne__(self, other): return Boolean(self.value != other.value)
    def __comp_le__(self, other): return Boolean(self.value <= other.value)
    def __comp_ge__(self, other): return Boolean(self.value >= other.value)
    def __comp_lt__(self, other): return Boolean(self.value < other.value)
    def __comp_gt__(self, other): return Boolean(self.value > other.value)

from .Number import Number