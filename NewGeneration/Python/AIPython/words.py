words = {}
for s in "abcdefghijklmnopqrstuvwxyz":
  words[s] = open("words/{}.txt".format(s), "r").read().split("\n")