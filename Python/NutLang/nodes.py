
class Node:
    def __eq__(self, other):
        if not isinstance(other, Node): return NotImplemented
        return type(self) is type(other) and self.__dict__ == other.__dict__
    def __ne__(self, other): return not (self == other)

class NumberNode(Node):
    def __init__(self, value): self.value = value
    def __repr__(self): return self.value+''

class BinaryOperationNode(Node):
    def __init__(self, op, left, right):
        self.left = left
        self.operator = op
        self.right = right
    def __repr__(self):
        return f'{self.left} {self.operator} {self.right}'