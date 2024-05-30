"Inside these dict 'COLORS' and 'BACKGROUNDS' are some syntax to color or have a background color the font inside the terminal. Use the function 'format' (it is inside this module) to use it effiecently."

COLORS = {"black": "\033[30m","red": "\033[31m","green": "\033[32m","yellow": "\033[33m","blue": "\033[34m","magenta": "\033[35m","cyan": "\033[36m","white": "\033[37m"}
BACKGROUNDS = {"black": "\033[40m","red": "\033[41m","green": "\033[42m","yellow": "\033[43m","blue": "\033[44m","magenta": "\033[45m","cyan": "\033[46m","white": "\033[47m"}
RESET = "\033[0m"; HIGHLIGHT = "\033[1m"; UNDERLINE = "\033[4m"; INVERSE = "\033[7m"

def format(txt: str, value: str = "[THIS]", mode: str or int = "color") -> str:
  """Arguments:
    txt          This contains the string needed to be formatted.(Required)
    value        This is the formatting spec. This will be the basses of the formatting. (Optional)
    mode         This can be either a string or int. Available strings are: 'color', 'background'. Available integers are: 0, 1. This specifies whether the color specified on 'value' is a color or a background. (Optional)
  Format:
    [THIS]       This will be the 'txt' argument.
    [RESET]      This resets the following modified texts.
    [UNDERLINE]  This underlines the following texts.
    [HIGHLIGHT]  This highlights the color of the following texts.
    [INVERSE]    This inverts the color and the background of the following texts.
    [COLOR]      Replace 'COLOR' with a real color to color the following texts depending on what mode are you.
  """
  modes = {"color": COLORS, "background": BACKGROUNDS}
  mode = modes[mode] if type(mode) == str else modes.values()[mode]
  txtrepl = {"[THIS]": txt, "[BLACK]": mode["black"], "[RED]": mode["red"], "[GREEN]": mode["green"], "[YELLOW]": mode["yellow"], "[BLUE]": mode["blue"], "[MAGENTA]": mode["magenta"], "[CYAN]": mode["cyan"], "[WHITE]": mode["white"], "[RESET]": RESET, "[HIGHLIGHT]": HIGHLIGHT, "[UNDERLINE]": UNDERLINE, "[INVERSE]": INVERSE}
  for k,v in txtrepl.items():
    value = value.replace(k, v)
  return value
