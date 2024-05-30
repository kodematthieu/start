var arr = function arr(...arrs) {return arrs};
var num = function num(x, o = 0) {return isNaN(Number(x)) ? o : x};

num.max = function max(...xs) {
  return Math.max(...xs.map(e=>num(e)));
};
num.min = function min(...xs) {
  return Math.min(...xs.map(e=>num(e)));
};
num.is = function is(x) {
  return isNaN(Number(x)) ? false : true;
};
num.radians = function radians(angle) {
  return angle * Math.PI / 180;
};
num.degrees = function degrees(angle) {
  return angle * 180 / Math.PI;
};
num.random = function random(a, b, c = null) {
  c = typeof b === "boolean" ? b : c;
  if(typeof a !== "number" && !(/^[0-9]+$/).test(a)) a = 0;
  if(typeof b !== "number" && !(/^[0-9]+$/).test(b)) b = 0;
  if(typeof a === "string") a = parseFloat(a);
  if(typeof b === "string") b = parseFloat(b);
  if(c === null && (!Number.isInteger(a) || !Number.isInteger(b))) c = true;
  if(c === null) c = false;
  var min = Math.min(a, b);
  var max = Math.max(a, b);
  var random = (Math.random()*(max-min)) + min;
  return !c ? Math.round(random) : random;
};
arr.equals = function equals(...arrs) {
  if(new Set(arrs.map(e => e.length)).size != 1) return false;
  for(let i = 0; i < arrs[0].length; i++) if(new Set(arrs.map(e => e[i])).size != 1) return false;
  return true;
};
export {num,arr};