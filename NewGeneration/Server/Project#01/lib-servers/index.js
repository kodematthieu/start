const PORT = process.env.PORT || 8000

const app = require("express")()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const uuid = () => "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/x/g, () => Math.round(Math.random()*16).toString(16))

const users = []
const rooms = []

io.on('connection', function(socket) {
  // console.log(socket.server.engine.clients.emit);
  socket.on('disconnect', function() {
    const room = rooms.filter(x => socket.id in x.connected)[0]
    if(room) {
      socket.leave(room.id)
      socket.to(room.id).emit("leave-room", {id: socket.id, connected: room.connected})
    }
  })
  socket.on("join-room", function({game, min, max}) {
    if(rooms.filter(x => typeof x === "object" && x.connected.length < max).length > 0) {
      const available = rooms.filter(x => typeof x === "object" && x.connected.length < max)
      const choosen = available[Math.round(Math.random()*(available.length-1))]
      rooms[rooms.findIndex(x => x.id === choosen.id)].connected.push(socket.id)
      io.in(choosen.id).emit("join-room", {id: socket.id, connected: rooms[rooms.findIndex(x => x.id === choosen.id)].connected})
      console.log(socket.join(choosen.id))
      console.log(socket.adapter.rooms);
    }
    else {
      const id = `${game}-${uuid()}`
      rooms.push({id, connected: [socket.id], min, max})
      io.in(id).emit("join-room", {id: socket.id, connected: rooms[rooms.findIndex(x => x.id === id)].connected})
      socket.join(id)
    }
    // console.log(rooms);
  })
  socket.on("room-send", function({game, data}) {
    const room = rooms.filter(x => typeof x === "object" && x.connected.includes(socket.id))[0]
    io.in(room).emit("room-send", data)
  })
})

app.use("/request", require("./request"))
app.use("/assets", require("./assets"))
app.use("/api/database", require("./database"))
app.use(require("./pages"))


server.listen(PORT, function() {
  console.log("Successfully established your server");
  console.log("Listening at 'http://localhost:%s'", PORT);
});
