"Some functions that you might need"

import Squark.Color as Color
import Squark.Chemist as Chemist
import Squark.Time as Time
import Squark.FileSystem as FileSystem

__version__ = "0.0.1"

class undefined(object):
  def __str__(self): return "undefined"
  def __bool__(self): return False
undefined = undefined()

def print(*args, **opts):
  """
  An alternate function for the builtin-function 'print'. The difference is that this has a keyword-based-argument 'color' that colors all the text.
  """
  import sys, time
  colors = {"black": "\033[30m","red": "\033[31m","green": "\033[32m","yellow": "\033[33m","blue": "\033[34m","magenta": "\033[35m","cyan": "\033[36m","white": "\033[37m"}
  fargs = []
  for e in args: fargs.append(str(e))
  txt = opts.get("sep"," ").join(fargs)
  txt = "".join([opts.get("start",""),colors[opts.get("color","")] if opts.get("color","") != "" else "", txt, "\033[0m" if opts.get("color","") != "" else "", opts.get("end", "\n")])
  sys.stdout.write(txt)
  sys.stdout.flush()
    
def input(prompt = '', default = '') -> str:
  """
  An alternate function for the builtin-function 'input'. The difference is that this can have a default return incase that the user only presses ENTER.
  """
  import sys
  print(prompt, end="({}) ".format(default) if default != '' else '')
  insert = sys.stdin.readline()
  insert = str(insert if insert != "\n" else default)
  result = []
  for i in range(len(insert) if not insert.endswith("\n") else len(insert)-1):
    result.append(insert[i])
  return "".join(result)
