
def OperatorNotImplemented(self, other):
    raise NotImplementedError()
def ComparatorNotImplemented(self, other):
    raise NotImplementedError()

def Operation(self, op, other):
    fn = None
    if op == '+': fn = self.__op_add__
    elif op == '-': fn = self.__op_sub__
    elif op == '*': fn = self.__op_mul__
    elif op == '/': fn = self.__op_div__
    if fn == None: raise TypeError(f'`{op}` is not an operator')
    try: return fn(other)
    except NotImplementedError:
        raise NotImplementedError(f'Operator `{op}` is not implemented')
def Comparison(self, comp, other):
    fn = None
    if comp == '==': fn = self.__comp_eq__
    elif comp == '!=': fn = self.__comp_ne__
    elif comp == '<=': fn = self.__comp_le__
    elif comp == '>=': fn = self.__comp_ge__
    elif comp == '<': fn = self.__comp_lt__
    elif comp == '>': fn = self.__comp_gt__
    if fn == None: raise TypeError(f'`{comp}` is not a comparator')
    try: return fn(other)
    except NotImplementedError:
        raise NotImplementedError(f'Comparator `{comp}` is not implemented')

class Metaclass(type):
    def __new__(self, name, bases, attrs):
        if not '__op_add__' in attrs: attrs['__op_add__'] = OperatorNotImplemented
        if not '__op_sub__' in attrs: attrs['__op_sub__'] = OperatorNotImplemented
        if not '__op_mul__' in attrs: attrs['__op_mul__'] = OperatorNotImplemented
        if not '__op_div__' in attrs: attrs['__op_div__'] = OperatorNotImplemented
        
        if not '__comp_eq__' in attrs: attrs['__comp_eq__'] = ComparatorNotImplemented
        if not '__comp_ne__' in attrs: attrs['__comp_ne__'] = ComparatorNotImplemented
        if not '__comp_le__' in attrs: attrs['__comp_le__'] = ComparatorNotImplemented
        if not '__comp_ge__' in attrs: attrs['__comp_ge__'] = ComparatorNotImplemented
        if not '__comp_lt__' in attrs: attrs['__comp_lt__'] = ComparatorNotImplemented
        if not '__comp_gt__' in attrs: attrs['__comp_gt__'] = ComparatorNotImplemented
        
        attrs['operate'] = Operation
        attrs['compare'] = Comparison
        return super(Metaclass, self).__new__(self, name, bases, attrs)

__all__ = ['Metaclass']