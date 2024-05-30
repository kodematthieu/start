# import math

HORIZONTAL = list("abcdefgh")

def LOCATIONTOMOVE(pos: dict):
  x = HORIZONTAL[pos["x"]];
  y = abs(8 - pos["y"]);
  return x+str(y);

def MOVETOLOCATION(move: str):
  x = None
  y = None
  move = list(move);
  for i in range(len(HORIZONTAL)):
    if HORIZONTAL[i] == move[0]: x = i;
  y = abs(int(move[1]) - 8);
  return {"x": x, "y": y};

class Board(list):
  def __init__(self, size: list):
    super(Board, self).__init__()
    self.size = size
    size = [self.size[0]/8, self.size[1]/8]
    for j in range(8):
      row = []
      for i in range(8):
        row.append({
          "highlight": False,
          "piece": None,
          "type": "white" if j % 2 == i % 2 else "black",
          "x": i*size[0] + size[0]/2,
          "y": j*size[1] + size[1]/2,
          "render": [
            { "x": i*size[0], "y": j*size[1], "width": size[0] - 1, "height": size[1] - 1},
            { "x": i*size[0], "y": j*size[1], "width": size[0] - 1, "height": size[1] - 1}
          ]
        })
      self.append(row)
  def __str__(self):
    result = []
    for j in range(8):
      row = []
      for i in range(8): row.append(LOCATIONTOMOVE({"x": i, "y": j}))
      result.append(row)
    return str(result)
  def sett(self, move, piece):
    where = MOVETOLOCATION(move)
    self[where["y"]][where["x"]]["piece"] = piece
    if piece != None:
      piece.location = move
      piece.board = self
    return self
  def gett(self, move):
    where = MOVETOLOCATION(move)
    return self[where["y"]][where["x"]]["piece"]
  def move(self, a, b):
    if not self.gett(a): raise
    if self.gett(a) and ((self.gett(b) and self.gett(b).type != self.gett(a).type) or self.gett(b) == None):
      self.sett(b, self.gett(a))
      self.sett(a, None)
      self.gett(b).move()
      self.gett(b).timesMoved += 1
    return self