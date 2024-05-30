const Vector = require('./lib/Vector');
const vec = new Vector(3, 4, 5);
// nv.x += 8
console.log(vec.clone().toString(), vec.toString());