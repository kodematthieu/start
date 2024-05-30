from board import LOCATIONTOMOVE
from board import MOVETOLOCATION

class Piece(object):
  def __init__(self, isLight):
    super(Piece, self).__init__()
    self.type = "white" if isLight else "black"
    self.texture = None
    self.board = None
    self.location = None
    self.timesMoved = 0
    self.move = lambda x: None
  def onmove(self, f): self.move = f
  def getSurroundingMoves(self):
    board = self.board
    location = MOVETOLOCATION(self.location)
    moves = []
    for j in range(-1, 2):
      for i in range(-1, 2):
        x = i+location["x"]
        y = j+location["y"]
        if ((x < 8 and -1 < x) and (y < 8 and -1 < y)) and (not (x == location["x"] and y == location["y"]) and ((board.gett(LOCATIONTOMOVE({"x": x, "y": y})) and board.gett(LOCATIONTOMOVE({"x": x, "y": y})).type != self.type) or board.gett(LOCATIONTOMOVE({"x": x, "y": y})) == None)):
          moves.append(LOCATIONTOMOVE({"x": x, "y": y}))
    return moves
  def getPawnMoves(self):
    location = MOVETOLOCATION(self.location)
    board = self.board
    moves = []
    for i in range(1, 2 if self.timesMoved > 0 else 3):
      adder = -i if self.type == "white" else i
      moves.append(LOCATIONTOMOVE({"x": location["x"], "y": location["x"]+adder}))
      if (location["y"] + adder > 7 or location["y"] + adder < 0) or board.gett(LOCATIONTOMOVE({"x": location["x"], "y": location["x"]+adder})) != None: break
    
    # if self.type == "white" && location["y"] > 0:
      
    # if self.type == "black" && location["y"] < 7:
    return moves