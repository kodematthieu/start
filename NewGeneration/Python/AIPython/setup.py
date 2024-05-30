import json, requests, database

words = requests.get("https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt")
words = words.text.split("\n")

for s in "abcdefghijklmnopqrstuvwxyz": open("words/{}.txt".format(s), "w").write("\n".join(filter(lambda e: e[0] == s, words)))

groups = database.offline("words/groups.json", autoload=True, autosave=True)
for w in "noun verb adjective adverb pronoun preposition conjunction determiner exclamation".split(" "): groups[w] = []

index = database.offline("words/index.json", autoload=True, autosave=True)
index["sentence"] = {}
index["sentence"]["order"] = [
  "<subject> <verb> <object>",
  "<auxiliary-verb> <subject> <verb>",
  "<modal-auxiliary> <subject> <verb>",
  "<subject> <verb> <indirect-object> <direct-object>",
  "<subject> <verb> <object> <preposition>",
]
index["sentence"]["translation"] = {
  "<auxiliary-verb>": "<verb>",
  "<indirect-object>": "<object>",
  "<direct-object>": "<object>",
  "<subject>": "[noun]|[pronoun]",
  "<object>": "[noun]",
  "<verb>": "[verb]|[adverb]",
  "<preposition>": "[preposition]"
}