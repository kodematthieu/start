import pygame, time
from board import Board, LOCATIONTOMOVE, MOVETOLOCATION
from pieces import Piece

(width, height) = (542, 542)
screen = pygame.display.set_mode((width, height))
board = Board([width, height])

screen.fill(0)

def update():
  for j in range(8):
    for i in range(8):
      tile = board[j][i]
      fill = (225, 250, 0, 100) if tile["highlight"] else (0, 0, 0, 0)
      rect = (tile["render"][1]["x"], tile["render"][1]["y"], tile["render"][1]["width"], tile["render"][1]["height"])
      pygame.draw.rect(screen, fill, rect)
      fill = (240, 217, 181) if tile["type"] == "white" else (181, 136, 99)
      rect = (tile["render"][0]["x"] + (5 if tile["highlight"] else 0), tile["render"][0]["y"] + (5 if tile["highlight"] else 0), tile["render"][0]["width"] - (10 if tile["highlight"] else 0), tile["render"][0]["height"] - (10 if tile["highlight"] else 0))
      pygame.draw.rect(screen, fill, rect, border_radius=round(min(tile["render"][0]["width"],tile["render"][0]["height"])/8) if tile["highlight"] else 0)
  pygame.display.update()

update()

while True:
  if pygame.mouse.get_pressed()[0] == True:
    (mouseX, mouseY) = pygame.mouse.get_pos()
    tileWidth = board.size[0]/8
    tileHeight = board.size[1]/8
    for y in range(8):
      for x in range(8):
        if (mouseX < tileWidth*(x+1) and mouseX > tileWidth*x) and (mouseY < tileHeight*(y+1) and mouseY > tileHeight*y):
          pos = LOCATIONTOMOVE({"x": x, "y": y})
          board.sett(pos, Piece(True))
          for i,e in enumerate(board.gett(pos).getPawnMoves()):
            location = MOVETOLOCATION(e)
            board[location["y"]][location["x"]]["highlight"] = True
  update()