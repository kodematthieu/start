from rply import LexerGenerator

lexer = LexerGenerator()

lexer.add('NUMBER', r'((\d+(\.\d*)?)|(\.\d+))(e[+/-]?\d+)?')
lexer.add('OP', r'[+\-*/]')
# lexer.add('COMPARATOR', r'()')

lexer.ignore(r'\s+')

Lexer = lexer.build()

__all__ = ['Lexer']