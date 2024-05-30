import sys, os

arrow = '\x1b[92m[\x1b[0m \x1b[33m{}\x1b[0m \x1b[92m]> \x1b[0m'


def main(farg = None, *args):
    exit = None
    while exit == None:
        ask = ''
        try: ask = input(arrow.format('~'))
        except KeyboardInterrupt: exit = (0,)
        os.system('python3 . ' + ask)
    if len(exit) > 1 and len(exit[1]) > 0: print(exit[1])
    sys.exit(exit[0])