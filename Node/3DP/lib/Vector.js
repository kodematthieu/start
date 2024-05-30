const Util = require('./Util');

const _x_ = new WeakMap();
const _y_ = new WeakMap();
const _z_ = new WeakMap();

/* -------------- Constructor -------------- */
const Vector = function Vector() {
    if(!(this instanceof Vector)) return new Vector(...arguments);
    _x_.set(this, NaN);
    _y_.set(this, NaN);
    _z_.set(this, NaN);
    this.set(...arguments);
    return this;
};
Object.setPrototypeOf(Vector, Object.create(null));

/* ---------------- Static ----------------- */
let define = Util.define(Vector);


/* --------------- Prototype --------------- */
define = Util.define(Vector.prototype);

// Accessors
define('x.get', function() {return _x_.has(this) ? _x_.get(this) : null});
define('y.get', function() {return _y_.has(this) ? _y_.get(this) : null});
define('z.get', function() {return _z_.has(this) ? _z_.get(this) : null});
define('x.set', function(v) {_x_.set(this, Number(v))});
define('y.set', function(v) {_y_.set(this, Number(v))});
define('z.set', function(v) {_z_.set(this, Number(v))});
define('length.get', function() {return Math.sqrt((this.x**2) + (this.y**2) + (this.z**2))});

// Constructor Methods
define('clone', function() {return new Vector(this)});
define('set.self', function(x, y, z) {
    if(arguments.length < 1) x = 0;
    if(x instanceof Array) {
        z = x[2];
        y = x[1];
        x = x[0];
    }
    else if(typeof x === 'object') {
        z = x.z;
        y = x.y;
        x = x.x;
    }
    this.x = typeof x !== 'undefined' ? x : 0;
    this.y = typeof y !== 'undefined' ? y : 0;
    this.z = typeof z !== 'undefined' ? z : 0;
});

// Main Operator Methods
define('add.self', function(x, y, z) {
    const vec = new Vector(x, y, z);
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
});
define('sub.self', function(x, y, z) {
    const vec = new Vector(x, y, z);
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
});
for(let [i, e] of Object.entries(['x', 'y', 'z'])) define(`add${e.toUpperCase()}`, function(v) {let vec = [0,0,0];vec[i] = v;return this.add(...vec)});
for(let [i, e] of Object.entries(['x', 'y', 'z'])) define(`sub${e.toUpperCase()}`, function(v) {let vec = [0,0,0];vec[i] = v;return this.sub(...vec)});

// Utility Operator Methods
define('rotate', function(x, y, z) {
    
})

// Conversion Methods
define('toJSON', function() {
    const attrs = Object.getOwnPropertyNames(this.constructor.prototype).filter(e => typeof this[e] !== 'function');
    const obj = {};
    for(let e of attrs) obj[e] = this[e];
    return obj;
});
define('toString', function() {return `<${this.constructor.name} [${[...this].join(', ')}]>`});
define(Symbol.iterator, function*() {
    yield this.x;
    yield this.y;
    yield this.z;
});
module.exports = Vector;