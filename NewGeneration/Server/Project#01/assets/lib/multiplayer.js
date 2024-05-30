const Server = function(game) {
  if(typeof game !== "string") game = window.location.pathname.slice(1, Infinity)
  const socket = io.connect(window.origin)
  socket.on("room-left", (id) => connected = connected.splice(connected.findIndex(x => x === id),i))
  this.send = function(data) {
    socket.emit("room-send", {game, data})
  }
  this.receive = function(callback) {
    if(typeof callback !== "function") callback = () => {}
    socket.on("room-send", callback)
  }
  this.room = function(callback = () => {}, min=2,max=2) {
    socket.on("join-room", ({id, connected}) => callback(id, connected))
    socket.on("leave-room", ({id, connected}) => callback(id, connected))
    socket.emit("join-room", {game, min: Math.min(min,max), max: Math.max(min,max)})
  }
}