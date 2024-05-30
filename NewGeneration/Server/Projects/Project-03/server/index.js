const rooms = new Map();

module.exports = async function({app, server, socket: io}) {
  io.on("connection", user => {
    user.on("room-join", (game, roomId) => {
      if(typeof roomId !== "string") roomId = "xxxxxxxx".replace(/x/g, _ => ("abcdefghijklmnopqrstuvwxyz0123456789-_")[Math.round(Math.random()*37)]).replace(/./g, _ => Math.round(Math.random()) == 0 ? _.toUpperCase() : _.toLowerCase());
      if(!rooms.has(roomId)) rooms.set(roomId, new Set());
      rooms.get(roomId).add(user.id);
      user.join(roomId);
      console.log(rooms);
    });
  });
};