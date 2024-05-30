const {Merror} = require("express-merror");
module.exports = (req, res, next) => {
  if(req.device.type === "bot") return next(new Merror(403, "Bots are not allowed in this site!"));
  return next();
};