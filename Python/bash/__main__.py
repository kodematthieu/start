#!/usr/bin/env python3

import sys, os, re
from cli import main as cli_main
from ip import main as ip_main
from IPAddress import IP


def main(farg = None, *args):
    if farg == 'cli': cli_main(*args)
    if farg == 'ip': ip_main(*args)
    else:
        pass

if __name__ == '__main__':
    args = sys.argv[1:]
    main(*args)