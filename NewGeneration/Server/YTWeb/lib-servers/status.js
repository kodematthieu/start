module.exports = function(server) {
  const io = require("socket.io")(server);
  const lastReq = {GET: [Date.now()], POST: [Date.now()], PUT: [Date.now()], DELETE: [Date.now()]};
  const lastRes = [Date.now()];
  io.on("connect", socket => {});
  return function(req, res, next) {
    console.log(req.headers.referer);
    lastReq[req.method].push(Date.now());
    res.locals.namespace = "Starry Star";
    req.status = {};
    req.status.clients = io.clients().server.eio.clientsCount;
    req.status.request = {};
    for(let request in lastReq) {
      if(lastReq[request].length < 2) continue;
      req.status.request[request] = lastReq[request];
    }
    if(lastRes.length > 1) req.status.response = lastRes;
    res.on("finish", () => lastRes.push(Date.now()));
    return next();
  };
};