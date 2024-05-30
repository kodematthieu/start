const Util = require("../util");
module.exports = io => {
  const responseTime = {GET: [], POST: [], PUT: [], DELETE: []};
  return (req, res, next) => {
    req.status = {};
    req.status.getter("timestamp", Date.now);
    req.status.users = Object.keys(io.eio.clients);
    req.status.responseTime = (() => {
      let final = {};
      for(let method in responseTime) {
        if(responseTime[method].length == 0) continue;
        if(responseTime[method].length > 2) final[method] = responseTime[method].reduce((a, b) => a+b)/responseTime[method].length;
        else if(responseTime[method].length == 1) final[method] = responseTime[method][0];
        final[method] = Util.round(final[method], 3);
      }
      return final;
    })();
    req.status.units = {time: "ms"};
    let now = Date.now();
    res.on("finish", () => responseTime[req.method].push(Date.now() - now));
    if(req.url === "/api/status?verbose=true&base=true") return res.json(req.status);
    return next();
  };
};
Object.defineProperty(Object.prototype, "setter", {value: function(name, value) {
  Object.defineProperty(this, name, {enumerable: true, configurable: true});
  Object.defineProperty(this, name, {set: value});
  return this;
}});
Object.defineProperty(Object.prototype, "getter", {value: function(name, value) {
  Object.defineProperty(this, name, {enumerable: true, configurable: true});
  Object.defineProperty(this, name, {get: value});
  return this;
}});