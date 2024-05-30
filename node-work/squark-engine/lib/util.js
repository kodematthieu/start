
function define(name, value, opts) {
    opts = Object.assign({enumerable: true, configurable: true}, opts);
    if(typeof value === 'function') {
        var decor = function() {return value.apply(this, arguments)};
        if(typeof name === 'string') {
            if((/^([a-zA-Z0-9_]+)\.self$/).test(name)) {
                name = name.match(/^([a-zA-Z0-9_]+)\.self$/)[1];
                decor = function() {
                   value.call(this, ...arguments);
                   return this;
                };
            }
            else if((/^([a-zA-Z0-9_]+)\.(set|get)$/).test(name)) {
                var method = name.match(/^([a-zA-Z0-9_]+)\.(set|get)$/)[2];
                name = name.match(/^([a-zA-Z0-9_]+)\.(set|get)$/)[1];
                Object.defineProperty(this, name, opts);
                Object.defineProperty(this, name, {[method]: value});
                return value;
            }
            Object.defineProperty(decor, 'name', {value: name, writable: true, configurable: true});
        }
        Object.defineProperty(this, name, Object.assign({value: decor, writable: true}, opts));
        return decor;
    }
    Object.defineProperty(this, name, Object.assign({value, writable: true}, opts));
    return value;
}
function createClass(name, constructor, opts) {
    name = String(name);
    var fnCall = opts.fnCall;if(!(typeof fnCall === 'function')) fnCall = null;
    var readable = !!opts.readable;
    var privates = opts.privates;if(!(privates instanceof Array)) privates = [];
    privates = privates.map(String).reduce(function(a, b) {a[b] = new WeakMap();return a}, {});
    var cls = function() {
        if(!(this instanceof cls) && typeof fnCall !== 'function')
            throw new TypeError("Class constructor "+name+" cannot be invoked without 'new'");
        else if(typeof fnCall === 'function' && !(this instanceof cls)) return fnCall.apply(cls, arguments);
        Object.defineProperty(this, 'privates', {value: Object.assign({}, privates), writable: true, enumerable: false, configurable: true});
        if(typeof constructor === 'function') constructor.apply(this, arguments);
        delete this.privates;
    };
    if(!readable) Object.setPrototypeOf(cls, Object.create(null));
    Object.defineProperty(cls, 'name', {value: name, writable: false, enumerable: false, configurable: true});
    define.call(cls.prototype, 'toArray', function() {return Array.from(this)}, {enumerable: false});
    define.call(cls.prototype, 'toJSON', function() {
        var props = Object.getOwnPropertyNames(cls.prototype).filter(function(e){try{return typeof cls.prototype[e] !== 'function'}catch(err){return e}});
        var obj = {};
        for(var p of props) if(!(this[p] instanceof this.constructor)) obj[p] = this[p];else Object.defineProperty(obj, p, {value: this[p], writable: true, configurable: true, enumerable: false});
        return obj;
    }, {enumerable: false});
    return {class: cls, privates: Object.assign({}, privates), define: define.bind(cls.prototype)};
}

module.exports = {createClass,define};