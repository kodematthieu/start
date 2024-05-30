import re
from math import floor
from functools import reduce
from .Object import Object

REGEX_OCTAL = r'^[+\-]?0[oO]([0-7]+)$'
REGEX_BINARY = r'^[+\-]?0[bB]([01]+)$'
REGEX_DECIMAL = r'^[+\-]?((\d+(\.\d*)?)|(\.\d+))(e[+/-]?\d+)?$'
REGEX_HEXADECIMAL = r'^[+\-]?0[xX]([a-fA-F0-9]+)$'

class Number(Object):
    def __init__(self, value):
        self.value = float(value)
        
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

from .Boolean import Boolean