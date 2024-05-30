import re

COLORS_NAMES = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
COLORS = {}
BG_COLORS = {}
STYLES = {}
for v,k in enumerate(['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']):
    COLORS[k] = v + 30
    COLORS['bright-'+k] = v + 90
    v = v + 10
    BG_COLORS[k] = v + 30
    BG_COLORS['bright-'+k] = v + 90
for v,k in enumerate(['reset', 'bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough']):
    STYLES[k] = v

def color(txt, *attrs):
    styles = []
    for attr1 in attrs:
        attr1 = attr1.lower()
        style = []
        if not re.match(r'^[a-z\-\_]+(\.[a-z\-\_]+)*$', attr1): continue
        for attr2 in attr1.split('.'):
            if not (
                re.match(fr'^(bg[\-_]?)?(bright[\-_]?)?({"|".join(COLORS_NAMES)})$', attr2) or
                re.match(fr'^({"|".join(STYLES.keys())})$', attr2)
            ): continue
            if re.match(fr'^(bg[\-_]?)?(bright[\-_]?)?({"|".join(COLORS_NAMES)})$', attr2):
                attr2 = re.findall(fr'^((bg)[\-_]?)?((bright)[\-_]?)?([a-z]+)$', attr2)[0]
                attr2 = [bool(attr2[1]), bool(attr2[3]), attr2[4]]
                if attr2[0]: style.append(BG_COLORS[('bright-' if attr2[1] else '') + attr2[2]])
                else: style.append(COLORS[('bright-' if attr2[1] else '') + attr2[2]])
            else: style.append(STYLES[attr2])
        styles.append(style)
    txt = txt.replace('%', '%0').replace('\{', '%1').replace('\}', '%2')
    return (styles, txt)
print()