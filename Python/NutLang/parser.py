from rply import ParserGenerator
from nodes import *

parser = ParserGenerator([
    'NUMBER', 'OP'
], cache_id='nut')

Parser = parser.build()

@parser.production('expr : expr OP expr')
def expr_binop(value):
    return BinaryOperationNode(value[1].getstr(), value[0], value[2])

@parser.production('expr : NUMBER')
def number(value):
    return NumberNode(value[0].getstr())


__all__ = ['Parser']