import sys, os, random, math

def translate():
  while True:
    scanner = input("Enter word: ")
    if scanner == ".q":
      sys.exit()
    else:
      lett = ["bcdfghjklmnpqrstvwsyz","aeiou"]
      text = scanner.split(" ")
      ntxt = []
      for j in range(len(text)):
        nword = []
        for i in range(len(text[j])):
          char = chr(random.randrange(97,122))
          if len(text[j]) > 5:
            rand = random.randint(0,1)
            char = lett[rand][random.randrange(0,len(lett[rand]))]
          nword.append(char)
        ntxt.append("".join(nword))
      print(" ".join(ntxt))

def pick():
  print("Separate Choices with this key ':'")
  prev = ""
  while True:
    scanner = input("Enter Choices: ")
    if scanner == ".p":
      scanner = prev
    if scanner == ".q":
      sys.exit()
    else:
      print("\033[33m{}\033[0m".format(random.choice(scanner.split(":"))))
    prev = scanner

if len(sys.argv) == 2:
  eval(str(sys.argv[1])+"()")
else:
  translate()