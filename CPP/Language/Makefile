CXX   = g++
FLAGS = -g -std=c++0x -std=c++17
FILES = main.cpp funcs.cpp
OBJS  = $(FILES:%.cpp=%.o)

APP = csl

HOME = /data/data/com.termux/files/home

all: $(APP)

$(APP): $(OBJS)

csl: $(OBJ)
	$(CXX) $(FLAGS) $(OBJS) -o $(APP)

run:
	cp -r $(APP) $(HOME)/$(APP)
	chmod u+x $(HOME)/$(APP)
	$(HOME)/$(APP)
	rm -f $(HOME)/$(APP)

clean:
	rm -f $(APP)
	rm -f *.o