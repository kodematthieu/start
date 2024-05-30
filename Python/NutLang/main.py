from classes import *
from lexer import *
from parser import *

with open('test.nut', 'r') as file:
    tokens = Lexer.lex(file.read())
    parsed = Parser.parse(tokens)
    print(parsed)